#!/usr/bin/env node

const net = require("net");
const WebSocket = require("ws");
const chalk = require("chalk");
const { program } = require("commander");
const ora = require("ora");
const fetch = require("node-fetch");
const cfg = require("./config");

program
  .name("livepreview")
  .description("Instantly expose your localhost to the world")
  .version("1.0.0");

// ─── START ────────────────────────────────────────────────────────
program
  .command("start")
  .description("Start a tunnel to expose your local port")
  .requiredOption("-p, --port <port>", "Local port to expose (e.g. 3000)")
  .option("-s, --subdomain <subdomain>", "Custom subdomain — Pro only")
  .option("-t, --token <token>", "API token (or set LIVEPREVIEW_TOKEN)")
  .action(async (opts) => {
    const token = opts.token || cfg.getToken() || "guest";
    const port = parseInt(opts.port);
    const apiUrl = cfg.getApiUrl();
    const wsServer = cfg.getServerUrl();

    if (isNaN(port) || port < 1 || port > 65535) {
      console.error(chalk.red("✗ Invalid port number"));
      process.exit(1);
    }

    const spinner = ora("Connecting to LivePreview...").start();

    // 1. Create tunnel via API
    let tunnelId, publicUrl, expiresAt;
    try {
      const res = await fetch(`${apiUrl}/tunnels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          localPort: port,
          subdomain: opts.subdomain || null,
        }),
      });
      const body = await res.json();
      if (body.error) {
        spinner.fail(chalk.red(`Error: ${body.error}`));
        if (body.upgrade_url)
          console.log(chalk.cyan(`  Upgrade: ${body.upgrade_url}`));
        process.exit(1);
      }
      tunnelId = body.tunnelId;
      publicUrl = body.publicUrl;
      expiresAt = body.expiresAt;
    } catch (err) {
      spinner.fail(chalk.red(`Could not reach server: ${err.message}`));
      process.exit(1);
    }

    // 2. Open WebSocket tunnel
    const wsUrl = `${wsServer
      .replace("https", "wss")
      .replace("http", "ws")}/ws/tunnel/${tunnelId}?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.on("open", () => {
      spinner.succeed(chalk.green("Tunnel established!"));
      console.log("\n" + chalk.bold("─".repeat(52)));
      console.log(chalk.cyan("  🌐 Public URL ") + chalk.bold.white(publicUrl));
      console.log(
        chalk.cyan("  🏠 Local      ") + chalk.white(`http://localhost:${port}`)
      );
      console.log(chalk.cyan("  🆔 Tunnel ID  ") + chalk.gray(tunnelId));
      if (expiresAt) {
        const min = Math.round((new Date(expiresAt) - Date.now()) / 60000);
        console.log(
          chalk.cyan("  ⏱  Expires    ") +
            chalk.yellow(`in ~${min} minutes (free plan)`)
        );
      }
      console.log(chalk.bold("─".repeat(52)));
      console.log(chalk.gray("\nForwarding requests... (Ctrl+C to stop)\n"));
    });

    ws.on("message", (data) => {
      let msg;
      try {
        msg = JSON.parse(data);
      } catch {
        return;
      }

      if (msg.type === "request") {
        forwardToLocal(port, msg, ws);
      }

      if (msg.type === "visitor") {
        const time = new Date().toLocaleTimeString();
        const flag = countryFlag(msg.country);
        console.log(
          chalk.gray(`[${time}]`) +
            " " +
            chalk.yellow(`${flag} ${msg.method}`) +
            " " +
            chalk.white(msg.path) +
            (msg.country ? chalk.gray(` [${msg.country}]`) : "")
        );
      }

      if (msg.type === "warning") {
        console.log(chalk.yellow(`\n⚠️  ${msg.message}\n`));
      }

      if (msg.type === "expired") {
        console.log(chalk.red(`\n⏱  ${msg.message}`));
        console.log(chalk.cyan("   Upgrade to Pro: livepreview upgrade\n"));
        process.exit(0);
      }
    });

    ws.on("close", (code, reason) => {
      if (code !== 1000) {
        console.log(
          chalk.red(`\n✗ Disconnected (${code}: ${reason || "unknown"})`)
        );
      }
      process.exit(0);
    });

    ws.on("error", (err) => {
      spinner.fail(chalk.red(`WebSocket error: ${err.message}`));
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log(chalk.yellow("\n\nClosing tunnel..."));
      try {
        await fetch(`${apiUrl}/tunnels/${tunnelId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (_) {}
      ws.close(1000, "User closed");
      process.exit(0);
    });
  });

// ─── LOGIN ────────────────────────────────────────────────────────
program
  .command("login")
  .description("Authenticate with your LivePreview account")
  .action(async () => {
    const apiUrl = cfg.getApiUrl();
    const spinner = ora("Initiating login...").start();

    try {
      const res = await fetch(`${apiUrl}/users/cli-auth/init`, {
        method: "POST",
      });
      const body = await res.json();
      spinner.stop();

      console.log(
        chalk.bold("\n─────────────────────────────────────────────")
      );
      console.log(chalk.cyan("  Open this URL in your browser to log in:\n"));
      console.log("  " + chalk.bold.white(body.auth_url));
      console.log(
        chalk.bold("─────────────────────────────────────────────\n")
      );

      const pollSpinner = ora("Waiting for authentication...").start();

      // Poll every 2 seconds for up to 5 minutes
      for (let i = 0; i < 150; i++) {
        await sleep(2000);
        const pollRes = await fetch(
          `${apiUrl}/users/cli-auth/poll/${body.code}`
        );
        const pollBody = await pollRes.json();

        if (pollBody.status === "authenticated") {
          cfg.setToken(pollBody.api_token);
          pollSpinner.succeed(chalk.green("Logged in successfully!"));
          console.log(chalk.gray("\nYour token has been saved. Run:"));
          console.log(chalk.cyan("  livepreview start -p 3000\n"));
          return;
        }
      }

      pollSpinner.fail(chalk.red("Login timed out. Please try again."));
    } catch (err) {
      spinner.fail(chalk.red(`Login error: ${err.message}`));
    }
  });

// ─── LOGOUT ───────────────────────────────────────────────────────
program
  .command("logout")
  .description("Log out and clear stored credentials")
  .action(() => {
    cfg.clearAll();
    console.log(chalk.green("✓ Logged out successfully."));
  });

// ─── STATUS ───────────────────────────────────────────────────────
program
  .command("status")
  .description("Show your account and active tunnels")
  .action(async () => {
    const token = cfg.getToken();
    const apiUrl = cfg.getApiUrl();

    if (!token || token === "guest") {
      console.log(chalk.yellow("Not logged in. Run: livepreview login"));
      return;
    }

    const spinner = ora("Fetching status...").start();
    try {
      const [meRes, tunnelsRes] = await Promise.all([
        fetch(`${apiUrl}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/tunnels`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const { user } = await meRes.json();
      const { tunnels } = await tunnelsRes.json();
      spinner.stop();

      console.log("\n" + chalk.bold("─".repeat(40)));
      console.log(chalk.cyan("  Account:  ") + chalk.white(user.email));
      console.log(
        chalk.cyan("  Plan:     ") + chalk.white(user.plan.toUpperCase())
      );
      console.log(chalk.bold("─".repeat(40)));

      const active = (tunnels || []).filter((t) => t.status === "active");
      if (active.length === 0) {
        console.log(chalk.gray("\n  No active tunnels.\n"));
      } else {
        active.forEach((t) => {
          console.log(`\n  ${chalk.green("●")} ${chalk.white(t.public_url)}`);
          console.log(
            `    Port ${t.local_port} · ${t.total_requests} requests`
          );
        });
        console.log("");
      }
    } catch (err) {
      spinner.fail(chalk.red(`Error: ${err.message}`));
    }
  });

// ─── UPGRADE ──────────────────────────────────────────────────────
program
  .command("upgrade")
  .description("Upgrade to Pro plan")
  .action(async () => {
    const token = cfg.getToken();
    const apiUrl = cfg.getApiUrl();

    if (!token || token === "guest") {
      console.log(chalk.yellow("Please log in first: livepreview login"));
      return;
    }

    const spinner = ora("Creating checkout session...").start();
    try {
      const res = await fetch(`${apiUrl}/billing/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const { url, error } = await res.json();
      if (error) {
        spinner.fail(chalk.red(error));
        return;
      }
      spinner.stop();
      console.log(chalk.cyan("\nOpen this URL to complete upgrade:\n"));
      console.log("  " + chalk.bold.white(url) + "\n");
    } catch (err) {
      spinner.fail(chalk.red(err.message));
    }
  });

// ─── HELPERS ──────────────────────────────────────────────────────
function forwardToLocal(port, msg, ws) {
  const start = Date.now();
  const socket = new net.Socket();

  socket.connect(port, "localhost", () => {
    socket.write(Buffer.from(msg.data, "base64"));
  });

  const chunks = [];
  socket.on("data", (chunk) => chunks.push(chunk));

  socket.on("end", () => {
    const responseData = Buffer.concat(chunks);
    // Parse status code from HTTP response
    const header = responseData.toString(
      "utf8",
      0,
      Math.min(responseData.length, 200)
    );
    const match = header.match(/HTTP\/\d\.\d (\d{3})/);

    ws.send(
      JSON.stringify({
        type: "response",
        requestId: msg.requestId,
        data: responseData.toString("base64"),
        statusCode: match ? parseInt(match[1]) : null,
        durationMs: Date.now() - start,
      })
    );
    socket.destroy();
  });

  socket.on("error", (err) => {
    ws.send(
      JSON.stringify({
        type: "error",
        requestId: msg.requestId,
        error: err.message,
      })
    );
  });

  socket.setTimeout(25_000, () => {
    socket.destroy();
    ws.send(
      JSON.stringify({
        type: "error",
        requestId: msg.requestId,
        error: "Local server timeout",
      })
    );
  });
}

function countryFlag(code) {
  if (!code || code.length !== 2) return "🌐";
  const offset = 127397;
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => c.charCodeAt(0) + offset)
  );
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

program.parse();
