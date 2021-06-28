import { BrowserRouter, Switch, Route } from 'react-router-dom'
import PageHeader from './components/PageHeader/PageHeader'
import Auth from './pages/Auth'
import IsuRoot from './pages/IsuRoot'
import GuardedRoute from './router/GuardedRoute'

const App = () => {
  return (
    <div className="flex flex-col min-h-full text-primary">
      <BrowserRouter>
        <PageHeader></PageHeader>
        <div className="flex-1 bg-teritary">
          <Switch>
            <GuardedRoute path="/" exact></GuardedRoute>
            <GuardedRoute path="/condition" exact>
              <div>通知画面</div>
            </GuardedRoute>
            <GuardedRoute path="/search" exact>
              <div>検索画面</div>
            </GuardedRoute>
            <GuardedRoute path="/isu/:id">
              <IsuRoot />
            </GuardedRoute>
            <Route path="/login">
              <Auth />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
