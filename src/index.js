// @flow
import FeedParser from 'feedparser'
import request from 'request'
import {Observable} from 'rxjs/Observable'

export interface Meta
{
  +title: string;
  +description: string;
  +link: string;
  +xmlurl: string;
  +date: string;
  +pubdate: string;
  +author: string;
  +language: string;
  +image: string;
  +favicon: ?string;
  +copyright: string;
  +generator: string;
  +categories: string[];
}

export interface Item
{
  +title: string;
  +description: string;
  +summary: string;
  +link: string;
  +origlink: string;
  +permalink: string;
  +date: string;
  +pubdate: string;
  +author: string;
  +guid: string;
  +comments: string;
  +image: string;
  +categories: string[];
  +source: {url: string, title: string};
  +enclousing: Object[];
  +meta: Meta;
}

export default ({url}: {url:string}): Observable<Item> => {
  const req = request(url);
  req.on('response', (res) => {
    if (res.statusCode !== 200){
      req.emit('error', new Error(`${url} Bad status code: ${res.statusCode}`));
    }
  });

  const feedparser = new FeedParser();
  const source: Observable<Item> = Observable.fromEvent(feedparser, 'data')
  req.pipe(feedparser);
  return source;
}
