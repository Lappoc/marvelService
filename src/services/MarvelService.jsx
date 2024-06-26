import {useHttp} from '../hooks/http.hook';

const useMarvelService = () => {
	
	const {loading, request, error, clearError} = useHttp();
	
	const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
	const _apiKey = 'apikey=c35d61692fb992dcf21b1578980b0dd8';
	const _hash = 'hash=03df19b5e0a49caaa13b46ee14dd7988';
	const _baseOffset = 210;

	const getAllCharacters = async (offset = _baseOffset) => {
		const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&ts=1&${_apiKey}&${_hash}`);
		return res.data.results.map(_transformCharacter);
	}
	
	const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&ts=1&${_apiKey}&${_hash}`);
		return res.data.results.map(_transformCharacter);
	}

	const getCharacter = async (id) => {
		const res = await request(`${_apiBase}characters/${id}?ts=1&${_apiKey}&${_hash}`);
		return _transformCharacter(res.data.results[0]);
	}
	
	const getAllComics = async (offset = 0) => {
		const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&ts=1&${_apiKey}&${_hash}`);
		return res.data.results.map(_transformComics);
	}
	
	const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?ts=1&${_apiKey}&${_hash}`);
		return _transformComics(res.data.results[0]);
	}

	const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items
		}
	}
	
	const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description: comics.description || 'There is no description',
			pageCount: comics.pageCount ? `${comics.pageCount} p.` : 'No information about the number of pages',
			thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
			language: comics.textObjects.language || 'en-us',
			price: comics.prices.price ? `${comics.prices.price}$` : 'not available'
		}
	}
	
	return {loading, error, clearError, getAllCharacters, getCharacterByName, getCharacter, getAllComics, getComic}
}

export default useMarvelService;
