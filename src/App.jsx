import './App.css'

function App() {
  return (
    <div className="app">
      <header>
        <h1>React CI/CD Pipeline Project</h1>
        <p>End-to-End CI/CD with Jenkins, Docker, SonarQube, Trivy, Terraform and Amazon EKS</p>
      </header>

      <main>
        <h2>Welcome to My DevOps Project</h2>

        <div className="pipeline">
          <div>GitHub</div>
          <div>Jenkins</div>
          <div>SonarQube</div>
          <div>Docker</div>
          <div>Trivy</div>
          <div>Amazon EKS</div>
        </div>

        <p>
          This React application will be automatically built, tested,
          scanned, containerized and deployed using a CI/CD pipeline.
        </p>
      </main>
    </div>
  )
}

export default App