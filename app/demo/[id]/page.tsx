export default function DemoPage({ params }: { params: { id: string } }) {
  // Disini Anda bisa me-render komponen tema asli (misal: ThemeRustic, ThemeModern, dll) 
  // menggunakan dummy data.
  return (
    <div className="flex min-h-screen items-center justify-center p-8 text-center bg-white text-slate-800">
      <div>
        <h1 className="text-2xl font-bold mb-4">Demo Tema: {params.id}</h1>
        <p>Halaman ini akan merender komponen desain undangan Anda.</p>
      </div>
    </div>
  )
}
