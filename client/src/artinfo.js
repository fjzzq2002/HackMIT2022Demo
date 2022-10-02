
import {url} from './url';
import {cfetch} from './cookiefetch';
import Cookies from "universal-cookie";
export async function artinfo(id) {
    const cookies = new Cookies();
    const articleList = await cfetch(
		url + "/api/getInfo?username" + cookies.get("username")
	);
    const article = await articleList.json();
    for (history of article.articles) 
        if (history.article === id) 
            return history;
    return {article :id, cost: -2, shared:true};
} 