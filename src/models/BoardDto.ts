import { BoardRow } from '../types/Board';

// We need to replace Board: BoardRow[], where BoardRow: BoardTile[],
// since we can't save 2D arrays into firestore DB. Therefore we
// replace an array of rows for a map of rows (the same could be done for BoardRow)
type BoardDto = Record<string, BoardRow>;

export default BoardDto;
