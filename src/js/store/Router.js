import UniversalRouter from 'universal-router';
import generateUrls from 'universal-router/generateUrls';
import createBrowserHistory from 'history/createBrowserHistory';
import api from '../api';
import setLoading from '../utils/setLoading';

class Router {
  routes = [
    {
      path: '',
      name: 'home',
      action: () => {
        this.store.openView('home');
        return false;
      }
    },
    {
      path: '/trade/:id',
      name: 'trade',
      action: () => {}
    },
    {
      path: '(.*)',
      name: '404',
      action: () => this.store.openView('404')
    }
  ];

    constructor(store) {
      this.router = new UniversalRouter(this.routes);
      this.urls = generateUrls(this.router);
      this.history = createBrowserHistory();
      this.store = store;
      this.history.listen(location => {
          return this.resolve(location);
      });
    }

  resolve(location) {
    if (!api.connected) {
      setLoading('Connecting to server...');
      api.connect();
      api.on('connect', async() => {
        setLoading(false);
        this.resolve(location);
      });
      return;
    }
    setLoading(false);
    this.router.resolve({pathname: location.pathname, ...location.state});
  }

  goTo(url, params, context = {}) {
    let goToUrl;
    try {
        goToUrl = this.urls(url, params);
    } catch(err) {
        goToUrl = url;
    }
    this.history.push(goToUrl, {
        previousUrl: this.history.location.pathname,
        ...context
    });
  }
}

export default Router;