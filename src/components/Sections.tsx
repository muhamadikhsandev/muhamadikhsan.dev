export const Hero = () => (
  <section id="home" className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
      Halo, Saya <span className="text-blue-500">Programmer</span>
    </h1>
    <p className="text-slate-400 max-w-2xl text-lg mb-8">
      Membangun solusi digital yang estetik dan fungsional dengan teknologi modern.
    </p>
    <a href="#projects" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition shadow-lg shadow-blue-500/20">
      Lihat Karya
    </a>
  </section>
);

export const About = () => (
  <section id="about" className="py-20 px-6 max-w-5xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-white mb-8">Tentang Saya</h2>
    <p className="text-slate-400 leading-relaxed text-lg">
      Saya adalah seorang pengembang perangkat lunak yang berfokus pada ekosistem JavaScript. 
      Sangat menyukai tantangan baru dan selalu belajar teknologi terbaru untuk memberikan hasil terbaik.
    </p>
  </section>
);

export const Skills = () => {
  const skills = ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"];
  return (
    <section id="skills" className="py-20 px-6 bg-slate-900/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Keahlian</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map(s => (
            <div key={s} className="bg-slate-800 border border-slate-700 p-6 rounded-xl text-blue-400 font-semibold text-center hover:border-blue-500 transition cursor-default">
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Projects = () => (
  <section id="proyek" className="py-20 px-6 max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-white mb-12 text-center">Proyek Terbaru</h2>
    <div className="grid md:grid-cols-2 gap-8">
      {[1, 2].map(i => (
        <div key={i} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 group">
          <div className="h-48 bg-slate-700 group-hover:bg-blue-900 transition-colors duration-500"></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">E-Commerce App 0{i}</h3>
            <p className="text-slate-400 mb-4">Platform belanja online yang cepat dan responsif menggunakan Next.js.</p>
            <div className="flex gap-2">
              <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">Next.js</span>
              <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">Supabase</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export const Contact = () => (
  <section id="contact" className="py-20 px-6 max-w-3xl mx-auto text-center">
    <div className="bg-blue-600 rounded-3xl p-10">
      <h2 className="text-3xl font-bold text-white mb-4">Ayo Mulai Sesuatu!</h2>
      <p className="text-blue-100 mb-8">Punya ide proyek atau sekadar ingin menyapa? Hubungi saya kapan saja.</p>
      <a href="mailto:email@kamu.com" className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition">
        Kirim Email
      </a>
    </div>
  </section>
);