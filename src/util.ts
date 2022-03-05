const filterPlayers = (entity: import('prismarine-entity').Entity): boolean => entity.type.toLowerCase() === 'player';

export { filterPlayers };