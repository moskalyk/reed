import React, { useEffect, useState } from 'react'
import Tree from 'react-tree-graph';
import clone from 'clone';
// import $ from 'jquery';

import './Atlas.css'

const Header = (props) => {
	// const componentDidMount() {
	// 	resize();
	// }

	const handleClick = () => {
		props.setActiveNode(null);
		// props.setFilter('');
		props.resize()
	}

	return (
		<div id="header">
			{/*<Filter filter={props.filter}/>*/}
			<button onClick={handleClick}>Reset</button>
		</div>);
}

// const Filter = (props) => {
// 	const handleChange = (e) => {
// 		console.log(e)
// 		props.setFilter(e.target.value);
// 	}

// 		return (
// 			<input
// 				id="search"
// 				type="text"
// 				placeholder="Filter nodes..."
// 				value={props.filter}
// 				onChange={handleChange}/>);
// }

function Atlas(props) {

	const [height, setHeight] = useState(window.innerHeight - 314)
	const [width, setWidth] = useState(window.innerWidth - 100)
	const [activeNode, setActiveNode] = useState(props.activeNode)
	const [root, setRoot] = useState(props.activeNode)
	const [loaded, setLoaded] = useState(false)

	useEffect(() => {
		// load data object from textile
		if(!loaded){
			console.log(props)
			filter()

			// setClassName(root);
			setLoaded(true)
		}
	})

	const filter = () => {
		let root = props.activeNode ? getRoot(props.data) : props.data;

		root = JSON.parse(JSON.stringify((root)))

		if (props.filter) {
			root = buildSubTree(root) || root;
		}
	}

	const resize = () => {
		setHeight(window.innerHeight - 314)
		setWidth(window.innerWidth - 100)
	}

	const handleClick = (event, node) => {
		console.log(node)
		setActiveNode(node);
		filter()

	}

	const getRoot = (json) => {
		console.log(json)
		if (json.name === props.activeNode) {
			return json;
		}else{
			console.log('HERE')
		}
		for (let i = 0; i < json.children.length; i++) {
			let childJson = getRoot(json.children[i]);
			if (childJson) {
				return childJson;
			}
		}
		return false;
	}

	const buildSubTree = (root) => {
		let newChildren = [];

		for (let i = 0; i < root.children.length; i++) {
			let child = buildSubTree(root.children[i]);
			if (child) {
				newChildren.push(child);
			}
		}

		if (newChildren.length > 0) {
			root.children = newChildren;
		}

		if (newChildren.length > 0 || root.name.toLowerCase().indexOf(props.filter.toLowerCase()) !== -1) {
			return root;
		}
		return null;
	}

	const setClassName = (node) => {
		console.log(node)
		node.children.forEach(setClassName, this);

		if (!props.filter) {
			return;
		}

		node.className = node.name.toLowerCase().indexOf(props.filter) === -1
			? 'node searchExcluded'
			: 'node searchIncluded';
	}

	return (
		<div>
		    <Header filter={props.filter} resize={resize} setActiveNode={setActiveNode}/>
			<Tree
				animated
				data={root}
				height={height}
				width={width}
				gProps={{
					className: 'node',
					onClick: handleClick
				}}
				textProps={{
					dy: 3.5
				}}
				steps={30}/>
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