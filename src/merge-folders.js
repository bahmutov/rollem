'use strict';

const R = require('ramda');
const path = require('path');

function isParentFolder(parentPath, childPath)
{
	const relative = path.relative(parentPath, childPath);
	return relative && !relative.startsWith('..');
}

function isChildFolder(childPath, parentPath)
{
	return isParentFolder(parentPath, childPath)
}

function mergeWatchedFolders(filenames)
{
	const folders = R.map(path.dirname, filenames);
	const cleanedFolders = R.map(path.normalize, folders);
	const uniqFolders = R.uniq(cleanedFolders);
	
	// eliminate any folder that is a child of another folder
	return uniqFolders.filter(folder =>
	{
		return !uniqFolders.some(possibleParent =>
		{
			return isChildFolder(folder, possibleParent)
		});
	});
}

module.exports = {
	isParentFolder,
	isChildFolder,
	merge: mergeWatchedFolders
};
