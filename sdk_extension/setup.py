from setuptools import setup, find_packages

setup(
    name="runpod-plus",
    version="0.1.0",
    description="Extended Open-Source SDK utilities for RunPod AI Engineers",
    author="Tejal Bhavsar",
    packages=find_packages(),
    install_requires=[
        "runpod>=1.6.0",
        "httpx>=0.27.0"
    ],
    python_requires=">=3.9",
)
