#!/bin/bash
npx kill-port 3000
npx kill-port 8545

# Navigate to Django project directory
cd myproject

# Start Django server
python manage.py runserver 8000 &

# Navigate back to the initial directory
cd ..


# Start Hardhat node
npx hardhat node &

# Give the node some time to start up
sleep 10

# Deploy and Retrieve the deployed contract address from the output and Set environment variable
(CONTRACT_ADDRESS=$(npx hardhat run scripts/deploy.cjs --network localhost | grep -oP 'Contract deployed to: \K(0x[0-9a-fA-F]{40})') && \
echo "NEXT_PUBLIC_HARDHAT=$CONTRACT_ADDRESS" >> .env) & 

# Start the Next.js development server
npm run dev



