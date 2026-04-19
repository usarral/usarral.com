export default async function globalTeardown() {
	const container = (global as any).__nginxContainer;
	if (container) await container.stop();
}
