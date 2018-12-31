import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import Snowflake from './snowflake';

export default class SnowFall extends Component {
	generateSnowflakes(numberOfSnowflakes, radius) {
		const snowflakes = [];
		for (let i = 0; i < numberOfSnowflakes; i++)
			snowflakes.push(
				<Snowflake
					key={'snowflake-' + i.toString()}
					radius={radius}
				/>
			);

		return snowflakes;
	}

	render() {
		const { width } = Dimensions.get('window');
		return (
			<View
				style={{
					flexDirection: 'row',
					height: 0,
					width,
					zIndex: 99999,
					position: 'absolute',
					top: 0,
				}}
			>
				{[
					...this.generateSnowflakes(Math.floor(this.props.numberOfSnowflakes)/3, 8),
					...this.generateSnowflakes(Math.floor(this.props.numberOfSnowflakes)/3, 5),
					...this.generateSnowflakes(Math.floor(this.props.numberOfSnowflakes)/3, 2),
				]}
			</View>
		);
	}
}
