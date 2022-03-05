import { TehcBot } from './bot';
import { Action } from './action';
// import { Vec3 } from 'vec3';

const bots: TehcBot[] = [];

for(let i=0;i<=Number.parseInt(process.argv[4]);i++) {
    bots.push(new TehcBot(`TehcBot${i}`, { host: process.argv[2], port: Number.parseInt(process.argv[3]) }))
}

// runs every physics tick
function tick(bot: TehcBot) {
    if(bot.bot.health <= 0) return; // can't do anything if dead lmao

    bot.addAction(new Action('moveToPlayer', () => {
        const player = bot.nearestPlayer();
        if(!player) return;
        bot.moveTo(player.position.offset(0, player.height, 0));
    }));
}

// runs every second
function fixedTick() {
    bots.forEach(bot => {
        bot.addAction(new Action('attackPlayer', () => {
            const player = bot.nearestPlayer();
            if(!player) return;
            bot.lookAt(player.position.offset(0, player.height, 0));
            bot.bot.attack(player);
        }));
    });
}

// this should be called in the tick event handler, but it wouldn't work sooo...
bots.forEach(bot => {
    bot.bot.on('physicsTick', () => {
        bot.tick();
        tick(bot); // do things
    });
});

setInterval(fixedTick, 1000);