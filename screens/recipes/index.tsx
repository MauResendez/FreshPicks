import React from 'react'
import WebView from 'react-native-webview'
import { global } from '../../style'

const Recipes = () => {
	return (
		<WebView
      style={[global.container, global.flex]}
      source={{ uri: 'https://www.utrgv.edu/pewd/cfsi/recipes' }}
    />
	)
}

export default Recipes