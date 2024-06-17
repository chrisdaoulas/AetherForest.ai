#!/bin/bash

# Start Hardhat node
npx hardhat node &

# Give the node some time to start up
sleep 10

# Deploy the contract
npx hardhat run scripts/deploy.cjs --network localhost

# Retrieve the deployed contract address from the output
CONTRACT_ADDRESS=$(npx hardhat run scripts/deploy.cjs --network localhost | grep -oP 'Contract deployed to: \K(0x[0-9a-fA-F]{40})')

# Set environment variable
export NEXT_PUBLIC_HARDHAT="$CONTRACT_ADDRESS"

# Navigate to Django project directory
cd myproject

# Start Django server
python manage.py runserver &

# Navigate back to the initial directory
cd ..

# Run the JavaScript file
node "C:/Users/cdaou/OneDrive/Documents/MSBDGA/Github/AmazoniaCoin/app/dashboard/carbon_credit_flow/deploy.js"
