import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { distance, expectedPace, userComment } = await request.json();

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.7,
      system: "Vous êtes un coach de course à pied professionnel. Générez un texte motivant pour une session d'entraînement en français, avec des encouragements fréquents.",
      messages: [
        {
          role: "user",
          content: `Générez un texte motivant pour une session d'entraînement avec les détails suivants :
          - Distance : ${distance} km
          - Allure attendue : ${expectedPace} min/km
          ${userComment ? `- Commentaire de l'utilisateur : ${userComment}` : ''}

          Instructions spécifiques :
          1. Fournissez des encouragements au moins toutes les 2 minutes.
          2. Utilisez le format suivant pour chaque paragraphe :
             [MM:SS] Texte d'encouragement ou d'instruction
          3. Commencez à 00:00 et continuez jusqu'à la fin estimée de la course.
          4. Adaptez le contenu en fonction de la progression de la course (début, milieu, fin).
          5. Incluez des références spécifiques à la distance et à l'allure attendue.
          6. Si un commentaire utilisateur est fourni, intégrez-le de manière pertinente.

          Exemple de format :
          [00:00] Texte pour le début de la course
          [02:00] Encouragement après 2 minutes
          [04:00] Autre encouragement
          ...
          [Temps estimé de fin] Félicitations pour avoir terminé la course

          Assurez-vous que le texte couvre toute la durée estimée de la course.`
        }
      ]
    });

    const generatedText = message.content[0].text;

    return NextResponse.json({ generatedText });
  } catch (error) {
    console.error('Erreur lors de la génération du texte:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération du texte' }, { status: 500 });
  }
}
