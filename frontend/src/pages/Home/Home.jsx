import styles from './Home.module.css'

const DESCRICAO = [
  'Reino Mágico é um sistema de RPG de mesa de fantasia épica que combina liberdade de criação, progressão sem níveis e um universo rico em história, magia e exploração. Em um mundo marcado pelo conflito entre forças primordiais, antigas divindades, entidades elementais e civilizações esquecidas, cada personagem possui o poder de deixar sua marca na história.',
  'Diferente de sistemas tradicionais, Reino Mágico permite que os jogadores evoluam seus personagens através de aprimoramentos, talentos e especializações, criando heróis únicos sem a limitação de níveis fixos. Cada escolha importa: desde a raça e classe até os caminhos mágicos, pactos sobrenaturais e habilidades desenvolvidas ao longo da jornada.',
  'O sistema oferece uma ampla variedade de opções para jogadores e mestres, incluindo diversas classes, raças exclusivas, centenas de magias divididas em diferentes tradições, equipamentos, talentos e mecânicas de combate estratégico. A magia não é apenas uma ferramenta de combate, mas uma força viva que influencia a política, a religião, a história e o próprio equilíbrio do mundo.',
  'Além das regras, Reino Mágico apresenta uma extensa mitologia própria. Desde o surgimento do universo através do choque entre forças ancestrais até as guerras que moldaram continentes inteiros, o cenário foi construído para oferecer campanhas profundas, exploração de mistérios antigos e narrativas que podem alterar o destino do mundo.',
]

export default function Home() {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Bem-vindo ao</p>
      <h1 className={styles.title}>Reino Mágico</h1>
      <p className={styles.subtitle}>Um Mundo Onde a Magia Molda o Destino</p>
      <div className={styles.divider} />

      <div className={styles.descricaoBlock}>
        {DESCRICAO.map((p, i) => <p key={i}>{p}</p>)}
      </div>

      <p className={styles.tagline}>
        Crie seu herói. Descubra os segredos do mundo. Escreva sua própria lenda.
      </p>
    </section>
  )
}
