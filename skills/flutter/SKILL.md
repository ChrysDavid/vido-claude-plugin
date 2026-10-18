---
name: flutter
description: Conventions Flutter du propriétaire (Clean Architecture, sécurité mobile, code niveau expert). À charger pour toute tâche dans une app Flutter.
---
# flutter

Code de niveau expert Dart/Flutter + sécurité mobile, sans raccourci. Projet existant : garder son state management (GetX chez Youmpi, ChangeNotifier chez BabiKiss, Riverpod chez Kokowa), ne pas en mélanger un autre. Nouveau projet : ces défauts.

## Outils officiels uniquement
- `flutter create`, `flutter pub add <pkg>` (jamais éditer pubspec.yaml à la main), `dart run build_runner build --delete-conflicting-outputs` (jamais écrire un `*.g.dart`/`*.freezed.dart`), flutter_launcher_icons / flutter_native_splash.
- Avant d'ajouter un package : vérifier sur pub.dev qu'il est maintenu.

## Architecture par feature
- `lib/core/{config,constants,error,network,routing,di,services,theme,utils,widgets}` + `lib/features/<nom>/{data,domain,presentation}`.
- `domain` : entities, interfaces de repository, usecases (une classe = un cas), en Dart pur.
- `data` : datasources, models (DTO), repositories (implémentation). `presentation` : pages, widgets, state.
- Sens unique : presentation → domain ← data. Jamais d'appel HTTP dans un widget, aucune logique métier dans un widget ni dans `main.dart`.
- Défauts : Riverpod, go_router, dio avec interceptors (refresh JWT), freezed + json_serializable, `Result` scellé pour les erreurs.

## Sécurité
- Aucun secret en dur : `--dart-define` / `--dart-define-from-file` avec fichier hors git ; un seul `.env`, environnement choisi par `ENV=dev|prod`.
- Tokens dans flutter_secure_storage, jamais shared_preferences.
- HTTPS obligatoire, cleartext désactivé ; aucun log de donnée sensible ; modèles nullable-safe (ne jamais faire confiance au JSON serveur).
- Release obfusquée (`--obfuscate --split-debug-info`), signature avec key.properties hors git.

## Clean code et UI
- Un widget = une responsabilité ; au-delà d'environ 150 lignes ou 3 niveaux d'imbrication, extraire. `final`/`const` par défaut, constantes nommées.
- Pas de `notifyListeners` pendant le build (charger via `addPostFrameCallback`).
- Thème centralisé dans `core/theme/` ; textes via la localisation (`Locale('fr')`).
- Jeux en WebView : jamais embarqués dans le bundle ; page d'erreur propre à l'app si le jeu ne répond pas.

## Vérification
- `flutter analyze` sans warning, `flutter test test/<feature>`. Test réel sur l'émulateur déjà actif quand c'est possible.
