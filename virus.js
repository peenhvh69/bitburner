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
		//ns.killall(server);

		// Find our threads that are usable.
		var availableThreads = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(ns.getScriptName()));

		// Sec
		const minSecurity = ns.getServerMinSecurityLevel(server);
		const security = ns.getServerSecurityLevel(server);
		let weakenThreads = Math.ceil((sec - minSecurity) / ns.weakenAnalyze(1));

		// $$$$
		let money = ns.getServerMoneyAvailable(server);
		if (money <= 0)
			money = 1;
		
		const maxMoney = ns.getServerMaxMoney(server);
		let growThreads = Math.ceil(ns.growthAnalyze(server, maxMoney / money));

		// Hackin'
		let hackThreads = Math.floor(ns.hackAnalyzeThreads(server, money) * 0.25);

		ns.print('INFO: Available Threads - ' + availableThreads);

		// Simple checks.
		if (ns.fileExists('BruteSSH.exe')) ns.brutessh(server);
		if (ns.fileExists('FTPCrack.exe')) ns.ftpcrack(server);
		if (ns.fileExists('HTTPWorm.exe')) ns.httpworm(server);
		if (ns.fileExists('relaySMTP.exe')) ns.relaysmtp(server);
		if (ns.fileExists('SQLInject.exe')) ns.sqlinject(server);

		// We need access right?
		ns.nuke(server);
		ns.print('INFO: Nuked ' + server);

		if (security > minSecurity && weakenThreads > 0) {
			ns.print('INFO: Weaken ran.');
			await ns.weaken(server, {threads: availableThreads * 0.25});
		}
		else if (money < maxMoney - maxMoney * 0.1 && growThreads > 0) {
			ns.print('INFO: Grow ran.');
			await ns.grow(server, {threads: availableThreads * 0.25});
		}
		else if (hackThreads > 0) {
			ns.print('INFO: Hack ran.');
			await ns.hack(server, {threads: availableThreads});
			ns.clearLog();
			await ns.sleep(5);
		}
	}
}