const filterPlayers = (entity: import('prismarine-entity').Entity): boolean => entity.type.toLowerCase() === 'player' && !entity.username?.includes('TehcBot');

export { filterPlayers };