<script lang="ts">
	let ws: WebSocket;
	let input = "";

	function handleSubmit(event: Event) {
		// console.log("SUBMIT");
		wsConn(input).then(() => {
			startRecording();
		});
		// console.log("SUBMIT END");
	}

	async function wsConn(code: string) {
		// console.log(code);
		// console.log(import.meta.env.VITE_APP_WS_API_URL);
		return new Promise((resolve, reject) => {
			ws = new WebSocket(
				import.meta.env.VITE_APP_WS_API_URL +
					"?consultant=yes&code=" +
					encodeURIComponent(code)
			);
			ws.onclose = (e) => {
				console.log("CLOSED");
				reject();
			};
			ws.onerror = (e) => {
				console.error(e);
				ws.close();
			};
			ws.onopen = (e) => {
				console.log("OPEN");
				resolve(null);
			};
		});
	}

	async function startRecording() {
		// get video/voice stream
		const stream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
			audio: false,
		});
		// @ts-ignore
		const peer1 = new SimplePeer({
			initiator: true,
			stream: stream,
		}) as any;

		ws.onmessage = (e) => {
			try {
				const data = JSON.parse(e.data);
				if (!("message" in data)) {
					peer1.signal(JSON.parse(e.data));
				}
			} catch (error) {
				console.error(error);
			}
			document.querySelector(".funnyiframe").classList.remove("hidden");
		};

		peer1.on("signal", (data) => {
			try {
				ws.send(
					JSON.stringify({
						action: "peermessage",
						data: JSON.stringify(data),
					})
				);
			} catch (error) {
				console.error(error);
			}
		});
	}
</script>

<div class="App">
	<div>
		<p>Connect to a client</p>
		<input type="text" id="codeInput" bind:value={input} />
		<button on:click={handleSubmit}>Connect</button>
		<div class="funnyiframe hidden">
			Ecommerce goes here :)
		</div>
	</div>
</div>
