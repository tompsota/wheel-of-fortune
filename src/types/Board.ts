export type BoardTile = {
	value: string | undefined;
	hidden: boolean;
};
export type BoardRow = BoardTile[];

type Board = BoardRow[];
export default Board;
