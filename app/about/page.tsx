import GoogleReviews from '@/components/home/GoogleReviews';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
      <header className="mb-16 border-b border-base-border pb-8">
        <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">
          The mind behind <span className="text-accent-gold">Royalfa.</span>
        </h1>
        <p className="text-xl text-text-muted font-serif italic">
          by Rodrigo Jesus Ramirez Tomasini
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* COLUMNA IZQUIERDA: Biografía + Habilidades */}
        <div className="md:col-span-2 space-y-10">
          
          {/* Tu texto */}
          <div className="space-y-6 text-text-muted leading-relaxed">
            <p className="text-lg text-text-main">
              Royalfa es el espacio donde la vocación docente, el pensamiento analítico y el diseño narrativo convergen.
            </p>
            <p>
              Con formación actuarial en la Facultad de Ciencias de la UNAM y más de tres décadas de trayectoria como asesor académico de tiempo completo, mi labor principal es la enseñanza. Me especializo en desglosar la complejidad de las ciencias exactas y naturales —matemáticas, física, química, cómputo, biología y lógica— para construir puentes de comprensión reales y duraderos para mis estudiantes.
            </p>
            <p>
              Esta dedicación a la educación ha evolucionado naturalmente hacia el desarrollo de software. Combino mi experiencia en el aula con el código para crear herramientas de aprendizaje interactivas e intuitivas. Actualmente, mi ecosistema cuenta con tres aplicaciones educativas probadas y publicadas, y dos nuevos proyectos tecnológicos en fase de desarrollo activo.
            </p>
            <p>
              Al mismo tiempo, la mente analítica necesita un lienzo creativo. El rigor que aplico al enseñar matemáticas o estructurar una base de datos es el mismo que utilizo para equilibrar mecánicas en Arkham Horror LCG, escribir antologías de ficción o diseñar el worldbuilding de escenarios fantásticos. Al final, ya sea en un aula, en una aplicación o en un juego de rol, el objetivo siempre es construir sistemas robustos que dejen huella.
            </p>
          </div>

          {/* Tus Habilidades debajo del texto (a 2 columnas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-base-border/30">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-accent-gold font-semibold mb-4">Academic & Tech</h3>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>Asesoría en Ciencias Exactas</li>
                <li>Desarrollo de Apps Educativas</li>
                <li>React, Next.js & Python</li>
                <li>Diseño Lógico y Estructural</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider text-accent-gold font-semibold mb-4">Creative Design</h3>
              <ul className="space-y-2 text-sm text-text-muted">
                <li>TTRPG Mechanics & Testing</li>
                <li>Narrative & Worldbuilding</li>
                <li>Escritura de Ficción</li>
                <li>Game Balance</li>
              </ul>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Solo Reseñas (Con efecto sticky para que bajen contigo) */}
        <div className="md:col-span-1">
          <div className="sticky top-8 pt-2">
            <GoogleReviews />
          </div>
        </div>

      </div>
    </div>
  );
}