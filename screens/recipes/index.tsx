import React from 'react'
import WebView from 'react-native-webview'
import { global } from '../../style'

const Recipes = () => {
	return (
		<WebView
      style={global.container}
      source={{ uri: 'https://www.utrgv.edu/pewd/cfsi/recipes' }}
    />
	)
}

export default Recipes