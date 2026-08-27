export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white">
            <span className="text-xl">〰</span>
          </div>

          <span className="text-lg font-semibold tracking-wide">
            EEG ANALYSIS
          </span>
        </div>

        <div className="hidden items-center gap-10 text-sm md:flex">
          <a href="#" className="border-b-2 border-white pb-2">
            Home
          </a>

          <a
            href="#about"
            className="text-gray-400 transition hover:text-white"
          >
            About
          </a>

          <a
            href="#features"
            className="text-gray-400 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="/dashboard"
            className="text-gray-400 transition hover:text-white"
          >
            Dashboard
          </a>

          <a
            href="/upload"
            className="rounded-md border border-white px-5 py-2.5 transition hover:bg-white hover:text-black"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden px-6">

        <div className="relative z-10 mx-auto max-w-4xl text-center">

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            EEG-Based Workload
            <br />
            Analysis
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-gray-400">
            Upload your EEG data and discover insights about
            mental workload using advanced machine learning.
          </p>

          <a
            href="/upload"
            className="mt-10 inline-block rounded-md bg-white px-8 py-4 font-semibold text-black transition hover:bg-gray-200"
          >
            Analyze EEG
          </a>
        </div>

        {/* EEG Wave */}
        <div className="absolute bottom-8 left-0 w-full opacity-80">

          <svg
            viewBox="0 0 1200 180"
            className="h-40 w-full"
            preserveAspectRatio="none"
          >
            <path
              d="
                M0 90
                C20 70 25 110 45 90
                S70 40 90 90
                S115 130 135 90
                S160 55 180 90
                S205 125 225 90
                S250 35 270 90
                S295 145 315 90
                S340 60 360 90
                S385 120 405 90
                S430 45 450 90
                S475 135 495 90
                S520 55 540 90
                S565 125 585 90
                S610 35 630 90
                S655 145 675 90
                S700 60 720 90
                S745 120 765 90
                S790 45 810 90
                S835 135 855 90
                S880 55 900 90
                S925 125 945 90
                S970 35 990 90
                S1015 145 1035 90
                S1060 60 1080 90
                S1105 120 1125 90
                S1150 45 1170 90
                S1190 110 1200 90
              "
              fill="none"
              stroke="white"
              strokeWidth="2"
            />

            <path
              d="
                M0 95
                C30 85 40 105 65 95
                S100 65 125 95
                S155 115 180 95
                S215 70 240 95
                S275 120 300 95
                S335 65 360 95
                S395 115 420 95
                S455 70 480 95
                S515 120 540 95
                S575 65 600 95
                S635 115 660 95
                S695 70 720 95
                S755 120 780 95
                S815 65 840 95
                S875 115 900 95
                S935 70 960 95
                S995 120 1020 95
                S1055 65 1080 95
                S1115 115 1140 95
                S1175 70 1200 95
              "
              fill="none"
              stroke="white"
              strokeWidth="1"
              opacity="0.35"
            />
          </svg>
        </div>
      </section>

      {/* What We Do */}
      <section
        id="features"
        className="bg-white px-6 py-24 text-black"
      >
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <h2 className="text-4xl font-bold">
              What We Do
            </h2>

            <div className="mx-auto mt-4 h-1 w-12 bg-black" />

            <p className="mx-auto mt-6 max-w-2xl text-gray-600">
              We process EEG signals and estimate cognitive workload
              using machine learning.
            </p>
          </div>

          {/* Features */}
          <div className="mt-16 grid gap-12 md:grid-cols-3">

            {/* Feature 1 */}
            <Feature
              icon="〰"
              title="EEG Processing"
              description="Advanced signal processing to clean and prepare EEG data."
            />

            {/* Feature 2 */}
            <Feature
              icon="◉"
              title="Workload Estimation"
              description="Machine learning models predict mental workload from EEG signals."
            />

            {/* Feature 3 */}
            <Feature
              icon="▮"
              title="Insights & Visualization"
              description="Visualize results and track workload trends over time."
            />

          </div>
        </div>
      </section>

      {/* Simple About */}
      <section
        id="about"
        className="bg-black px-6 py-20 text-center"
      >
        <h2 className="text-3xl font-bold">
          Understand Your Mental Workload
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-gray-400">
          Our system combines EEG signal processing and machine
          learning to provide meaningful workload insights.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black px-6 py-6 text-center text-sm text-gray-500">
        EEG Workload Analysis © 2026
      </footer>
    </main>
  );
}


/* Feature Component */

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      <p className="mx-auto mt-3 max-w-xs leading-6 text-gray-600">
        {description}
      </p>

    </div>
  );
}