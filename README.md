Bonjour et bienvenu sur cette application.

Pour utliser l'application, il vous faut :
    - Un programme de permettant de gérer un serveur distant (J'utilise WAMP).
    - prisma : lancer dans le terminal "npm i @prisma/client @latest".
    - Dans le fichier .env:
            DATABASE_URL="mysql(language utilisé)://root(identifiant de connexion):root(mot de passe)@localhost:3306(port utilisé pour la BDD)/planningparents(nom de la BDD) ".

Mettez vos informations afin de pouvoir autoriser prisma à se connecter et effectuer des changement.

    - 'npx primsa migrate dev' pour connecter prisma a la BDD
    - 'npx prisma generate' pour importer les models présent dans schema.prisma

Une fois cela fait, créer vous un compte puis profitez de l'application.

La sécurité n'est pas encore au point ainsi que le CSS. Ce sont des aspect qui seront travaillé dans le futur.

Si vous rencontrez des problèmes n'hésitez pas a me contacter par mail: <alexis.moretto78@gmail.com> ou par téléphone : 06 78 49 19 43.

Cette application est bien évidemment en developpement. C'est donc normal que certaine fonctionnalité de ne soit pas présente ou ne fonctionne pas.

Cette application est développé avec Next.js.
