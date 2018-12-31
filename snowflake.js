import React, { Component } from 'react';
import { Animated, Easing, Dimensions, AppState } from 'react-native';


export default class SnowflakeFall extends Component {
	snowFallAnimation = null;

	constructor(props) {
		super(props);

		this.state = {
			...this.initializeSnowflakesCoordinates(),
			appState: AppState.currentState,
		};
	}

	componentDidMount() {
		AppState.addEventListener('change', this._handleAppStateChange);
		this.startAnimation();
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}

	_handleAppStateChange = (nextAppState) => {
		// active --> inactive
		if (this.state.appState.match(/active|foreground/) && nextAppState === 'inactive') {
			this.stopAnimation();
		}

		// inactive --> active
		if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
			this.startAnimation();
		}

		this.setState({ appState: nextAppState });
	}

	initializeSnowflakesCoordinates() {
		return {
			x: new Animated.Value(0),
			y: new Animated.Value(0),
			delayFall: Math.random() * 20000,
			delayShake: Math.random() * 10000,
		};
	}

	startAnimation() {
		this.state.y.setValue(0);
		this.state.x.setValue(0);
		this.snowFallAnimation = Animated.parallel([
			Animated.loop(Animated.timing(
				this.state.x,
				{
					delay: this.state.delayShake,
					toValue: 1,
					duration: 20000 + Math.random() * 10000,
					easing: Easing.easeInOutQuint,
					useNativeDriver: true,
				}
			)),
			Animated.loop(Animated.timing(
				this.state.y,
				{
					delay: this.state.delayFall,
					toValue: 1,
					easing: Easing.linear,
					duration: 20000 + Math.random() * 10000,
					useNativeDriver: true,
				}
			)),
		]);
		this.snowFallAnimation.start();
	}

	stopAnimation() {
		if (this.snowFallAnimation)
			this.snowFallAnimation.stop();
	}

	generateFallAnimation() {
		const { height } = Dimensions.get('window');
		return [{
			translateY: this.state.y.interpolate({
				inputRange: [0, 1],
				outputRange: [-10, 2 * height],
			}),
		}];
	}

	generateShakeAnimation() {
		const sign = (-1) ** Math.floor(Math.random());
		return [{
			translateX: this.state.x.interpolate({
				inputRange: [0, 0.5, 1],
				outputRange: [0, sign * 80, 0],
			}),
		}];
	}

	render() {
		const { width } = Dimensions.get('window');
		return (
			<Animated.View
				style={{
					backgroundColor: '#FFFFFF',
					borderRadius: this.props.radius / 2,
					left: width * Math.random() - 200,
					top: -10,
					width: this.props.radius,
					height: this.props.radius,
					opacity: this.props.radius / 10,
					transform: [
						...this.generateFallAnimation(),
						...this.generateShakeAnimation(),
					],
				}}
			/>
		);
	}
}
