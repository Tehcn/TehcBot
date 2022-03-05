import { TehcBot } from './bot';
import { Action } from './action';
// import { Vec3 } from 'vec3';

const bot = new TehcBot('TehcBot', { host: 'localhost', port: 60734 });

// runs every physics tick
function tick() {
    if(bot.bot.health <= 0) return; // can't do anything if dead lmao

    bot.addAction(new Action('moveToPlayer', () => {
        const player = bot.nearestPlayer();
        if(!player) return;
        bot.moveTo(player.position.offset(0, player.height, 0));
    }));
}

// runs every second
function fixedTick() {
    bot.addAction(new Action('attackPlayer', () => {
        const player = bot.nearestPlayer();
        if(!player) return;
        bot.lookAt(player.position.offset(0, player.height, 0));
        bot.bot.attack(player);
    }));
}

// this should be called in the tick event handler, but it wouldn't work sooo...
bot.bot.on('physicsTick', () => {
    bot.tick();
    tick(); // do things
});

setInterval(fixedTick, 1000);