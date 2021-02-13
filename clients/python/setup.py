import setuptools

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setuptools.setup(
    name="micooc",
    version="0.1.4",
    author="ariman",
    author_email="biaofu@thoughtworks.com",
    description="Micoo client for python",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/Mikuu/Micoo",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
