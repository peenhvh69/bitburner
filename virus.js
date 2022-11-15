/** @param {NS} ns */
export async function main(ns) {
	let server = ns.args[0];
	let host = ns.getHostname();

	ns.disableLog('ALL');
	ns.clearLog();

	//ns.tail();

	ns.print(host);
	ns.print('INFO: Target - ' + server);

	while (true) {
		ns.killall(server);

		var availableThreads = Math.floor(ns.getServerMaxRam(host) / ns.getScriptRam(ns.getScriptName()));

		ns.print('INFO: Available Threads - ' + availableThreads);

		if (ns.fileExists('BruteSSH.exe')) ns.brutessh(server);
		if (ns.fileExists('FTPCrack.exe')) ns.ftpcrack(server);
		if (ns.fileExists('HTTPWorm.exe')) ns.httpworm(server);
		if (ns.fileExists('relaySMTP.exe')) ns.relaysmtp(server);
		if (ns.fileExists('SQLInject.exe')) ns.sqlinject(server);

		ns.nuke(server);
		ns.print('INFO: Nuked ' + server);

		if (ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)) {
			ns.print('INFO: Weaken ran.');
			await ns.weaken(server, {threads: availableThreads});
		}

		if (ns.getServerGrowth(server) < 100) {
			ns.print('INFO: Grow ran.');
			await ns.grow(server, {threads: availableThreads});
		}

		ns.print('INFO: Hack ran.');
		await ns.hack(server, {threads: availableThreads});
		ns.clearLog();
		await ns.sleep(5);
	}
}