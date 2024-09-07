import { $contextMenu } from '../helpers/context-menu'

export function useContextMenu() {
	const handleBlockContextMenu = e => {
		$contextMenu({ evt: e })
	}

	return {
		handleBlockContextMenu
	}
}
