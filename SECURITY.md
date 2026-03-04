# Security Policy

## Reporting a Vulnerability
Si vous découvrez une faille de sécurité, merci de ne pas l'ouvrir en issue publique. Envoyez un signalement à [cyranoaladin@gmail.com].

## Secret Protection
- N'incluez **jamais** de secrets dans vos commits.
- Utilisez des variables d'environnement locales (`.env.local`) qui sont ignorées par Git.
- La variable `SALT` est obligatoire en production pour le hachage cryptographique des identifiants élèves.
