# TPLGEN

*Third party licenses generator*

## Install

```
npm install -g tplgen
```

## How to use

To generate third party licenses for you project. You must decide:

- Where should the generated file be
- Should TPLGEN generate the dev dependencies also

To set the location for the generated file, you can just input the file name.

```
$ tplgen THIRD-PARTY-LICENSES.txt
```

And if you want you dev dependencies to be included also, use

```
$ tplgen THIRD-PARTY-LICENSES.txt --withDev
```

If you also want all the licenses of the dependencies that your dependencies used then use the `--depOfdep` flag.

```
$ tplgen THIRD-PARTY-LICENSES.txt --depOfdep
```

## Author

- [Hung Nguyen](https://github.com/ZeroX-DG)([twitter](https://twitter.com/ZeroX_Hung))

## LICENSE

[MIT](LICENSE)
