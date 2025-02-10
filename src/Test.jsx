import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FatSecretRecipes = () => {
  const CLIENT_ID = '6f1e44e098504ab39c299c77bbc0df8f'; // Replace with your actual FatSecret Client ID
  const CLIENT_SECRET = '1c555e5dc782424a8d8c5a476eae0547t'; // Replace with your actual FatSecret Client Secret
  const TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';

  const [accessToken, setAccessToken] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getAccessToken = async () => {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('scope', 'basic');

      const response = await axios.post(
        'https://oauth.fatsecret.com/connect/token',
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      console.log(accessToken);
      const accessToken = response.data.access_token;
      //   setToken(accessToken);/
      return accessToken;
    } catch (err) {
      console.error('Error getting OAuth token:', err);
      setError('Authentication failed.');
      return null;
    }
  };

  // Function to fetch recipes
  const fetchRecipes = async () => {
    if (!accessToken) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        'https://platform.fatsecret.com/rest/recipes/search/v3',
        {
          params: {
            calories_from: 200,
            calories_to: 500,
            protein_percentage_from: 10,
            protein_percentage_to: 50,
            carb_percentage_from: 20,
            carb_percentage_to: 60,
            fat_percentage_from: 10,
            fat_percentage_to: 40,
            max_results: 5,
            format: 'json',
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(response.data.recipes);
      setRecipes(response.data.recipes.recipe);
    } catch (err) {
      setError('Error fetching recipes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch access token on mount
  useEffect(() => {
    getAccessToken();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">FatSecret Recipe Search</h2>

      <button
        onClick={fetchRecipes}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        disabled={loading || !accessToken}
      >
        {loading ? 'Loading...' : 'Fetch Recipes'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-4">
        {recipes.length > 0 ? (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.recipe_id} className="border-b py-2">
                <h3 className="font-bold">{recipe.recipe_name}</h3>
                <p>{recipe.recipe_description}</p>
                <img
                  src={recipe.recipe_image}
                  alt={recipe.recipe_name}
                  className="w-32 h-32 rounded-md mt-2"
                />
                <p>Calories: {recipe.recipe_nutrition.calories} kcal</p>
                <p>Protein: {recipe.recipe_nutrition.protein}g</p>
                <p>Carbs: {recipe.recipe_nutrition.carbohydrate}g</p>
                <p>Fat: {recipe.recipe_nutrition.fat}g</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default FatSecretRecipes;
