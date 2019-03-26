## Plugin Badges

Download badges for plugins hosted on Spigot, DevBukkit, Ore, and GitHub.

Create badges using the following website. https://pluginbadges.glitch.me/

---

### How it Works

The download numbers will be pulled from each site specified and combined. The total value will be displayed on the badge.

---

Format: `https://pluginbadges.glitch.me/api/v1/dl/<name>-<color>.svg`

Supports:
  * **DevBukkit** (`https://dev.bukkit.org/projects/<id>`)
    * `?bukkit=<id>`
  * **Spigot** (`https://www.spigotmc.org/resources/<id>`)
    * `?spigot=<id>`
  * **Ore (Sponge)** ([Plugin Id](https://docs.spongepowered.org/stable/en/ore/routes/project.html))
    * `?ore=<id>`
  * **GitHub** (`https://github.com/<user>/<repo>`)
    * `?ghuser=<user>`
    * `?ghrepo=<repo>`

You can connect multiple parameters with `&`. Supports most https://shields.io/ parameters. Please file an issue if any are missing.

Ex.

https://pluginbadges.glitch.me/api/v1/dl/SkyChanger-limegreen.svg?spigot=skychanger.37524&bukkit=skychanger&ore=skychanger&ghuser=dscalzi&ghrepo=SkyChanger&style=for-the-badge

![Example Image](https://pluginbadges.glitch.me/api/v1/dl/SkyChanger-limegreen.svg?spigot=skychanger.37524&bukkit=skychanger&ore=skychanger&ghuser=dscalzi&ghrepo=SkyChanger&style=for-the-badge)