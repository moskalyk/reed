import React, { useEffect } from 'react'
import Tree from 'react-tree-graph';
import clone from 'clone';
import $ from 'jquery';

import './Atlas.css'

const Filter = () => {
	const handleChange = (e) => {
		console.log(e)
		// setFilter(e.target.value);
	}

		return (
			<input
				id="search"
				type="text"
				placeholder="Filter nodes..."
				value={this.props.filter}
				onChange={this.handleChange}/>);
}


function Atlas(props) {
	useEffect(() => {
		// load data object from textile
	})

	const handleClick = (event, node) => {
		console.log(node)
		// setActiveNode(node);
	}

	const getRoot = (json) => {
		if (json.name === this.props.activeNode) {
			return json;
		}
		for (let i = 0; i < json.children.length; i++) {
			let childJson = this.getRoot(json.children[i]);
			if (childJson) {
				return childJson;
			}
		}
		return false;
	}

	const buildSubTree = (root) => {
		let newChildren = [];

		for (let i = 0; i < root.children.length; i++) {
			let child = this.buildSubTree(root.children[i]);
			if (child) {
				newChildren.push(child);
			}
		}

		if (newChildren.length > 0) {
			root.children = newChildren;
		}

		if (newChildren.length > 0 || root.name.toLowerCase().indexOf(this.props.filter.toLowerCase()) !== -1) {
			return root;
		}
		return null;
	}

	const setClassName = (node) => {
		node.children.forEach(setClassName, this);

		if (!props.filter) {
			return;
		}

		node.className = node.name.toLowerCase().indexOf(this.props.filter) === -1
			? 'node searchExcluded'
			: 'node searchIncluded';
	}

	console.log(props)
	let root = props.activeNode ? getRoot(props.data) : props.data;

	root = clone(root);

	if (props.filter) {
		root = buildSubTree(root) || root;
	}

	setClassName(root);

	return (
		<div>
		    <div className="App">
    
		    <h1 className='title' style={{color: 'white'}}>
		      A t l a s
		    </h1>
			<Tree
				animated
				data={root}
				height={$(window).height() - 100}
				width={$(window).width() - 100}
				gProps={{
					className: 'node',
					onClick: handleClick
				}}
				textProps={{
					dy: 3.5
				}}
				steps={30}/>
			</div>
		</div>
		)
}

export default Atlas;

// TreeContainer extends React.PureComponent {
// 	handleClick(event, node) {
// 		setActiveNode(node);
// 	}

// 	getRoot(json) {
// 		if (json.name === this.props.activeNode) {
// 			return json;
// 		}
// 		for (let i = 0; i < json.children.length; i++) {
// 			let childJson = this.getRoot(json.children[i]);
// 			if (childJson) {
// 				return childJson;
// 			}
// 		}
// 		return false;
// 	}

// 	buildSubTree(root) {
// 		let newChildren = [];

// 		for (let i = 0; i < root.children.length; i++) {
// 			let child = this.buildSubTree(root.children[i]);
// 			if (child) {
// 				newChildren.push(child);
// 			}
// 		}

// 		if (newChildren.length > 0) {
// 			root.children = newChildren;
// 		}

// 		if (newChildren.length > 0 || root.name.toLowerCase().indexOf(this.props.filter.toLowerCase()) !== -1) {
// 			return root;
// 		}
// 		return null;
// 	}

// 	setClassName(node) {
// 		node.children.forEach(this.setClassName, this);

// 		if (!this.props.filter) {
// 			return;
// 		}

// 		node.className = node.name.toLowerCase().indexOf(this.props.filter) === -1
// 			? 'node searchExcluded'
// 			: 'node searchIncluded';
// 	}

// 	render() {
// 		let root = this.props.activeNode ? this.getRoot(this.props.data) : this.props.data;

// 		root = clone(root);

// 		if (this.props.filter) {
// 			root = this.buildSubTree(root) || root;
// 		}

// 		this.setClassName(root);

// 		return (
// 			<Tree
// 				animated
// 				data={root}
// 				height={this.props.height}
// 				width={this.props.width}
// 				gProps={{
// 					className: 'node',
// 					onClick: this.handleClick
// 				}}
// 				textProps={{
// 					dy: 3.5
// 				}}
// 				steps={30}/>);
// 	}
// }