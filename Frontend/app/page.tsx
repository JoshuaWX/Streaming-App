import HeroSection from '@/components/hero-section'
import ContentCarousel from '@/components/content-carousel'
import Footer from '@/components/footer'

const trendingMovies = [
  { id: '1', title: 'The Last Horizon', rating: 8.5, year: 2024 },
  { id: '2', title: 'Echoes of Tomorrow', rating: 8.2, year: 2024 },
  { id: '3', title: 'Midnight Chronicles', rating: 7.9, year: 2023 },
  { id: '4', title: 'Beyond the Stars', rating: 8.7, year: 2024 },
  { id: '5', title: 'Lost in Time', rating: 7.6, year: 2023 },
  { id: '6', title: 'Crimson Skies', rating: 8.3, year: 2024 },
  { id: '7', title: 'The Digital Age', rating: 8.1, year: 2024 },
  { id: '8', title: 'Whispers in the Wind', rating: 7.8, year: 2023 },
]

const newReleases = [
  { id: '9', title: 'The Final Quest', rating: 8.4, year: 2024 },
  { id: '10', title: 'Neon Dreams', rating: 8.0, year: 2024 },
  { id: '11', title: 'Thunder Heart', rating: 8.6, year: 2024 },
  { id: '12', title: 'Silent Witness', rating: 7.7, year: 2024 },
  { id: '13', title: 'Dark Secrets', rating: 8.2, year: 2024 },
  { id: '14', title: 'Golden Coast', rating: 7.9, year: 2024 },
  { id: '15', title: 'Frozen Fire', rating: 8.5, year: 2024 },
  { id: '16', title: 'The Comeback', rating: 8.1, year: 2024 },
]

const topRated = [
  { id: '17', title: 'Masterpiece', rating: 9.2, year: 2023 },
  { id: '18', title: 'The Greatest Show', rating: 9.0, year: 2023 },
  { id: '19', title: 'Legacy', rating: 8.9, year: 2022 },
  { id: '20', title: 'Eternal', rating: 8.8, year: 2023 },
  { id: '21', title: 'Symphony', rating: 8.7, year: 2023 },
  { id: '22', title: 'Revolution', rating: 9.1, year: 2022 },
  { id: '23', title: 'Journey', rating: 8.6, year: 2023 },
  { id: '24', title: 'Horizon', rating: 8.5, year: 2023 },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <ContentCarousel title="Trending Now" movies={trendingMovies} />
      <ContentCarousel title="New Releases" movies={newReleases} />
      <ContentCarousel title="Top Rated" movies={topRated} />
      <Footer />
    </main>
  )
}
