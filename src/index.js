import FeedParser from 'feedparser'
import request from 'request'
import Rx from 'rxjs/Rx'

export default ({url}): Rx.Observable<Item> => {
  const req = request(url);
  req.on('response', (res) => {
    if (res.statusCode !== 200) {
      req.emit('error', new Error(`${url} Bad status code: ${res.statusCode}`));
    }
  });

  const feedparser = new FeedParser();
  const source = Rx.Observable.fromEvent(feedparser, 'data')
  req.pipe(feedparser);
  const appendPubMilitime = item => {
      const pubMilitime = new Date(item.pubdate).getTime();
      return { ...item, pubMilitime };
  };
  return source.map(appendPubMilitime);
}
