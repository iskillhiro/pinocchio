const formatDate = isoString => {
	const date = new Date(isoString)
	return date.toLocaleDateString('en-EN', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

export default formatDate
