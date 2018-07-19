import UniversalRouter from 'universal-router';
import generateUrls from 'universal-router/generateUrls';
import createBrowserHistory from 'history/createBrowserHistory';
import api from '../api';
import setLoading from '../utils/setLoading';

class Router {
  routes = [
    {
      path: '',
      name: 'admin',
      action: () => {
        this.store.view.setView('admin');
        return false;
      }
    },
    {
      path: '/login',
      name: 'login',
      action: () => {
        this.store.view.setView('login');
        return false;
      }
    },
    {
      path: '(.*)',
      name: '404',
      action: () => {
        this.store.view.setView('404');
        return false;
      }
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
    // check login
    if (location.pathname !== '/login') {
      if (!this.store.user.token) {
        this.history.replace('/login');
        setLoading(false);
        return;
      }
    }
    if (!api.connected) {
      setLoading('Connecting to server...');
      api.connect(this.store.user.token);
      api.socket.once('connect', async() => {
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