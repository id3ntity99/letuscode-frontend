import React, { createRef, useEffect } from "react";
import { Terminal } from "xterm";
import { AttachAddon } from "xterm-addon-attach";
import { FitAddon } from "xterm-addon-fit";
import { useNavigate } from "react-router-dom";

function Console() {
	const terminalEl = createRef();
	const HOST = "ws://api.letuscode.click:1111";
	const terminalOption = {
		theme: {
			background: "#000000",
		},
		disableStdin: true,
		cursorStyle: "bar",
		fontFamily: "courier",
		scrollback: 0,
	};
	const navigate = useNavigate();

	function openWebSocket(url) {
		return new WebSocket(url);
	}

	function openTerminal(targetElement, socket) {
		const terminal = new Terminal(terminalOption);
		const attachAddon = new AttachAddon(socket);
		const fitAddon = new FitAddon();
		terminal.loadAddon(attachAddon);
		terminal.loadAddon(fitAddon);
		terminal.open(targetElement);
		fitAddon.fit();
		return terminal;
	}

	function writeInitMessage(terminal) {
		terminal.writeln("     __         __     __  __    ");
		terminal.writeln("    / /   ___  / /_   / / / /____");
		terminal.writeln("   / /   / _ \\/ __/  / / / / ___/");
		terminal.writeln("  / /___/  __/ /_   / /_/ (__  ) ");
		terminal.writeln(" /_____/\\___/\\__/   \\____/____/  ");
		terminal.writeln(" ");
		terminal.writeln("| Online IDE for code:us");
		terminal.writeln(" ");
		terminal.writeln("| Powered By Xterm.js");
		terminal.writeln(" ");
		terminal.writeln(" ");
	}

	async function init() {
		const socket = await openWebSocket(HOST);
		const terminal = openTerminal(terminalEl.current, socket);
		socket.onopen = (event) => {
			writeInitMessage(terminal);
			terminal.writeln("\r");
			terminal.options.disableStdin = false;
		};
		socket.onclose = (event) => {
			if (event.code === 1008) {
				console.log("Policy violation");
				navigate("/", { replace: true });
			}
		};
	}

	useEffect(() => {
		init();
	});

	return (
		<div id="terminal-container">
			<div id="terminal" ref={terminalEl}></div>
		</div>
	);
}

export default Console;
