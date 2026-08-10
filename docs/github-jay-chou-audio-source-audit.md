# GitHub Jay Chou Audio Source Audit

Date: 2026-08-08

## Conclusion

No reviewed GitHub repository provides evidence of permission from the relevant
recording and music-rights holders to publicly stream Jay Chou recordings. Do
not add any of these repositories as a fallback audio provider.

An open-source license declared by a repository owner governs that owner's
contribution. It is not evidence that the owner controls the neighbouring
copyrighted sound recordings or has granted public-performance / streaming
rights for them.

## Reviewed Candidates

| Repository | Evidence in the repository | License / authorization result | Decision |
| --- | --- | --- | --- |
| [Sky0805/JayChou](https://github.com/Sky0805/JayChou) | The repository contains MP3 files including `七里香.mp3` and `不能说的秘密.mp3`; its README only says `周董的music`. | GitHub shows no repository license and the README contains no rights-holder authorization or streaming terms. | Reject as a public playback source. |
| [shenmingshuo/music](https://github.com/shenmingshuo/music) | The tracked application assets include `public/static/music/mojito.mp3`, `说好不哭.mp3`, and other recordings. | GitHub shows no repository license. Its README is the stock Create React App text and contains no licensing or public-streaming authorization. | Reject as a public playback source. |
| [bobbyngo/Jay-Chou-Music-Player](https://github.com/bobbyngo/Jay-Chou-Music-Player) | The README describes a player for Jay Chou music; tracked `music/*.mp3` files are part of the project. | The repository uses `Unlicense`, but neither the README nor license identifies a recording-rights owner or grants rights to stream the included music. | Reject as a public playback source. |
| [zjoe2111/JayChouMusics](https://github.com/zjoe2111/JayChouMusics) | The README states: `仅学习使用，请在下载后24小时内删除` (learning use only; delete within 24 hours). | The stated use restriction is not an authorization for public streaming; its `Unlicense` also cannot establish third-party recording rights. | Reject. |
| [AndrewChung-GitHub/jay_music_download](https://github.com/AndrewChung-GitHub/jay_music_download) | The repository description is `下载周杰伦(Jay Chou)所有无损音乐` (download all lossless Jay Chou music). | No repository license or rights-holder authorization is presented. Its stated purpose is downloading, not licensed delivery. | Reject. |
| [huyongnd/JayMusicFiles](https://github.com/huyongnd/JayMusicFiles) | The repository includes FLAC tracks, for example `music/周杰伦-晴天.flac`; its README states `仅学习使用，请在下载后24小时内删除`. | No license or rights-holder authorization for recording distribution / public streaming is supplied. | Reject. |

## Source Verification Method

This review used only each repository's first-party GitHub materials:

- repository root / README;
- tracked tree paths exposed by the repository; and
- the repository's GitHub license metadata and license file where present.

Absence of an authorization statement is not a claim that a particular user did
not obtain a private license. It means the public repository does not provide
enough evidence for this application to distribute or stream those tracks.

## Safe Integration Rule

Add a non-GD audio provider only when its repository or provider documentation
identifies the rights holder, explicitly permits the intended public streaming
use, and supplies a stable HTTPS playback endpoint. Store the documented
authorization reference beside the provider configuration and fall back only
between providers that satisfy that rule.

For personal listening, a user-selected local file can remain a separate
`local` provider. It must not be uploaded or re-served to other users by this
application.
