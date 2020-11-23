import React from 'react'

import styles from './styles.scss'

interface Props {}

class Test extends React.Component {
  render() {
    return <div>Test</div>
  }
}

const App: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <div className={styles.root}>
      App <Test />
    </div>
  )
}

export default App
