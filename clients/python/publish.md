Publish to PyPi
---

- update version in `setup.py`

- generate package
```commandline
python3 setup.py sdist bdist_wheel
```

- publish package to PyPi
```commandline
sudo python3 -m twine upload --repository pypi dist/*
```
