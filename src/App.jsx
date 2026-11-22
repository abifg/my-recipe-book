
import { useEffect, useState, useRef } from 'react'
import './App.css'

const starterRecipes = [
  {
    id: 1,
    name: 'Омлет с сыром',
    category: 'Завтраки',
    time: 15,
    servings: 2,
    ingredients: [
      { name: 'Яйца', amount: '3', unit: 'шт.' },
      { name: 'Молоко', amount: '100', unit: 'мл' },
      { name: 'Сыр', amount: '50', unit: 'г' },
    ],
    description: 'Нежный омлет с расплавленным сыром.',
    instructions: 'Взбей яйца с молоком. Добавь тёртый сыр. Готовь на сковороде до готовности.',
    notes: '',
    emoji: '🍳',
  },
  {
    id: 2,
    name: 'Курица с рисом',
    category: 'Обеды',
    time: 35,
    servings: 2,
    ingredients: [
      { name: 'Курица', amount: '300', unit: 'г' },
      { name: 'Рис', amount: '150', unit: 'г' },
      { name: 'Лук', amount: '1', unit: 'шт.' },
      { name: 'Морковь', amount: '1', unit: 'шт.' },
    ],
    description: 'Сытное блюдо на каждый день.',
    instructions: 'Нарежь курицу и овощи. Обжарь лук с морковью, добавь курицу и рис. Влей воду и туши до готовности.',
    notes: '',
    emoji: '🍚',
  },
  {
    id: 3,
    name: 'Салат с помидорами',
    category: 'Салаты',
    time: 10,
    servings: 2,
    ingredients: [
      { name: 'Помидоры', amount: '2', unit: 'шт.' },
      { name: 'Огурцы', amount: '1', unit: 'шт.' },
      { name: 'Сыр', amount: '50', unit: 'г' },
    ],
    description: 'Свежий салат с овощами и сыром.',
    instructions: 'Нарежь овощи и сыр. Смешай ингредиенты и добавь заправку по вкусу.',
    notes: '',
    emoji: '🥗',
  },
  {
    id: 4,
    name: 'Сырники',
    category: 'Завтраки',
    time: 25,
    servings: 2,
    ingredients: [
      { name: 'Творог', amount: '300', unit: 'г' },
      { name: 'Яйца', amount: '1', unit: 'шт.' },
      { name: 'Мука', amount: '40', unit: 'г' },
      { name: 'Сахар', amount: '20', unit: 'г' },
    ],
    description: 'Домашние сырники к завтраку.',
    instructions: 'Смешай творог, яйцо, муку и сахар. Сформируй сырники и обжарь с обеих сторон до готовности.',
    notes: '',
    emoji: '🥞',
  },
  {
    id: 5,
    name: 'Яблочный пирог',
    category: 'Десерты',
    time: 50,
    servings: 6,
    ingredients: [
      { name: 'Яблоки', amount: '3', unit: 'шт.' },
      { name: 'Мука', amount: '180', unit: 'г' },
      { name: 'Яйца', amount: '2', unit: 'шт.' },
      { name: 'Сахар', amount: '100', unit: 'г' },
    ],
    description: 'Ароматный пирог с яблоками.',
    instructions: 'Подготовь тесто из яиц, сахара и муки. Добавь нарезанные яблоки и выпекай до готовности.',
    notes: '',
    emoji: '🥧',
  },
  {
    id: 6,
    name: 'Паста с сыром',
    category: 'Ужины',
    time: 20,
    servings: 2,
    ingredients: [
      { name: 'Макароны', amount: '200', unit: 'г' },
      { name: 'Сыр', amount: '70', unit: 'г' },
      { name: 'Молоко', amount: '100', unit: 'мл' },
    ],
    description: 'Простой ужин из доступных продуктов.',
    instructions: 'Отвари макароны. Подогрей молоко, добавь сыр и перемешай с макаронами.',
    notes: '',
    emoji: '🍝',
  },
]

const categories = [
  'Завтраки',
  'Обеды',
  'Ужины',
  'Салаты',
  'Закуски',
  'Десерты',
  'Выпечка',
  'Напитки',
  'Другое',
]

const weekDays = [
  { id: 'monday', label: 'Понедельник' },
  { id: 'tuesday', label: 'Вторник' },
  { id: 'wednesday', label: 'Среда' },
  { id: 'thursday', label: 'Четверг' },
  { id: 'friday', label: 'Пятница' },
  { id: 'saturday', label: 'Суббота' },
  { id: 'sunday', label: 'Воскресенье' },
]

const mealTypes = [
  { id: 'breakfast', label: 'Завтрак' },
  { id: 'lunch', label: 'Обед' },
  { id: 'dinner', label: 'Ужин' },
]

const emptyForm = {
  name: '',
  image: '',
  category: 'Завтраки',
  time: '20',
  servings: '2',
  calories: '',
  protein: '',
  fat: '',
  carbs: '',
  ingredients: [
  {
    name: '',
    amount: '',
    unit: 'г',
    calories: '',
    protein: '',
    fat: '',
    carbs: '',
  },
],
    instructions: '',
  notes: '',
  videoUrl: '',
  sourceUrl: '',
}

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}


function calculateNutrition(ingredients) {
  const totals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  }

  const hasValue = {
    calories: false,
    protein: false,
    fat: false,
    carbs: false,
  }

  const keys = ['calories', 'protein', 'fat', 'carbs']

  ingredients.forEach((item) => {
    const amount = Number(
  String(item.amount).replace(',', '.')
)

const nutritionWeight = Number(item.nutritionWeight)

const hasNutritionWeight =
  item.nutritionWeight !== '' &&
  item.nutritionWeight != null &&
  Number.isFinite(nutritionWeight) &&
  nutritionWeight > 0

if ((!Number.isFinite(amount) || amount <= 0) && !hasNutritionWeight) {
  return
}

    let calculationAmount = 0

    if (item.nutritionBasis === '100ml') {
      if (item.unit === 'мл') {
        calculationAmount = amount
      } else if (item.unit === 'л') {
        calculationAmount = amount * 1000
      } else {
        return
      }
    } else {
  if (item.nutritionWeight !== '' &&
      item.nutritionWeight != null &&
      Number(item.nutritionWeight) > 0) {
    calculationAmount = Number(item.nutritionWeight)
  } else if (item.unit === 'г') {
    calculationAmount = amount
  } else if (item.unit === 'кг') {
    calculationAmount = amount * 1000
  } else {
    return
  }
}

    if (!calculationAmount || calculationAmount <= 0) return

    keys.forEach((key) => {
      const value = item[key]

      if (value === '' || value == null || !Number.isFinite(Number(value))) {
        return
      }

      totals[key] += Number(value) * calculationAmount / 100
      hasValue[key] = true
    })
  })

  return {
    calories: hasValue.calories ? totals.calories : null,
    protein: hasValue.protein ? totals.protein : null,
    fat: hasValue.fat ? totals.fat : null,
    carbs: hasValue.carbs ? totals.carbs : null,
  }
}
function App() {
  const [recipes, setRecipes] = useState(() =>
    loadFromStorage('my-recipes-list', starterRecipes)
  )
  const [favorites, setFavorites] = useState(() =>
    loadFromStorage('my-recipes-favorites', [])
  )
  const [category, setCategory] = useState('Все рецепты')
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [showSortMenu, setShowSortMenu] = useState(false)
  const sortControlRef = useRef(null)
  useEffect(() => {
  function handlePointerDown(event) {
    if (
      sortControlRef.current &&
      !sortControlRef.current.contains(event.target)
    ) {
      setShowSortMenu(false)
    }
  }

  document.addEventListener('pointerdown', handlePointerDown)

  return () => {
    document.removeEventListener('pointerdown', handlePointerDown)
  }
}, [])
  const [sortWasSelected, setSortWasSelected] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [ingredientMode, setIngredientMode] = useState(false)
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showPlanner, setShowPlanner] = useState(false)
  const [mealPlan, setMealPlan] = useState(() =>
  loadFromStorage('my-recipes-weekly-plan', {})
)
const [checkedShoppingItems, setCheckedShoppingItems] = useState(() =>
  loadFromStorage('my-recipes-checked-items', [])
)
  const [editingId, setEditingId] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [nutritionView, setNutritionView] = useState('total')
  const [displayServings, setDisplayServings] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const calculateIngredientNutrition = (ingredients) => {
  const result = calculateNutrition(ingredients)

  return result || {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  }
}

  const [formError, setFormError] = useState('')

  useEffect(() => {
    localStorage.setItem('my-recipes-list', JSON.stringify(recipes))
  }, [recipes])
  useEffect(() => {
  localStorage.setItem(
    'my-recipes-weekly-plan',
    JSON.stringify(mealPlan)
  )
}, [mealPlan])

useEffect(() => {
  localStorage.setItem(
    'my-recipes-checked-items',
    JSON.stringify(checkedShoppingItems)
  )
}, [checkedShoppingItems])

  useEffect(() => {
    localStorage.setItem('my-recipes-favorites', JSON.stringify(favorites))
  }, [favorites])

  const allIngredients = [...new Set(
    recipes.flatMap((recipe) =>
      recipe.ingredients.map((item) => item.name.trim()).filter(Boolean)
    )
  )].sort((a, b) => a.localeCompare(b, 'ru'))

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      category === 'Все рецепты' || recipe.category === category

    const query = search.trim().toLocaleLowerCase('ru')
    const matchesSearch =
      recipe.name.toLocaleLowerCase('ru').includes(query) ||
      recipe.ingredients.some((item) =>
        item.name.toLocaleLowerCase('ru').includes(query)
      )

    const matchesIngredients = selectedIngredients.every((item) =>
      recipe.ingredients.some((ingredient) =>
        ingredient.name.toLocaleLowerCase('ru') === item.toLocaleLowerCase('ru')
      )
    )

    const matchesFavorites =
      !onlyFavorites || favorites.includes(recipe.id)

    return matchesCategory && matchesSearch &&
      matchesIngredients && matchesFavorites
  })

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
  if (sortOrder === 'alphabetical') {
    return a.name.localeCompare(b.name, 'ru')
  }

  if (sortOrder === 'time') {
    return (Number(a.time) || 0) - (Number(b.time) || 0)
  }

  return Number(b.id) - Number(a.id)
})
const originalServings = Math.max(
  1,
  Number(selectedRecipe?.servings) || 1
)

const nutritionMultiplier =
  nutritionView === 'serving'
    ? 1 / originalServings
    : nutritionView === '100g'
      ? Number(selectedRecipe?.weight) > 0
        ? 100 / Number(selectedRecipe.weight)
        : 1
      : displayServings / originalServings

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }
  
  function handleImageUpload(event) {
  const file = event.target.files[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Выбери файл изображения.')
    return
  }

  const reader = new FileReader()

  reader.onloadend = () => {
    updateForm('image', reader.result)
  }

  reader.readAsDataURL(file)
}

  function updateIngredient(index, field, value) {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  function addIngredientRow() {
    setForm((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
       {
  name: '',
  amount: '',
  unit: 'г',
  nutritionWeight: '',
  nutritionBasis: '100g',
  calories: '',
  protein: '',
  fat: '',
  carbs: '',
},
      ],
    }))
  }

  function removeIngredientRow(index) {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.filter((_, i) => i !== index),
    }))
  }

  function openNewRecipeForm() {
    setEditingId(null)
    setForm({ ...emptyForm, ingredients: [{ name: '', amount: '', unit: 'г' }] })
    setFormError('')
    setShowForm(true)
    setSelectedRecipe(null)
  }

  function openEditForm(recipe) {
    setEditingId(recipe.id)
    setForm({
      name: recipe.name,
      image: recipe.image || '',
      category: recipe.category,
      time: String(recipe.time),
      servings: String(recipe.servings),
      weight: String(recipe.weight ?? ''),
      calories: String(recipe.calories ?? ''),
      protein: String(recipe.protein ?? ''),
      fat: String(recipe.fat ?? ''),
      carbs: String(recipe.carbs ?? ''),
      ingredients: recipe.ingredients.map((item) => ({ ...item })),
      instructions: recipe.instructions || '',
      notes: recipe.notes || '',
      videoUrl: recipe.videoUrl || '',
      sourceUrl: recipe.sourceUrl || '',
    })
    setFormError('')
    setShowForm(true)
    setSelectedRecipe(null)
  }

  function saveRecipe(event) {
    event.preventDefault()

    
const ingredients = form.ingredients
  .map((item) => ({
    name: item.name.trim(),
    amount: item.amount.trim(),
    unit: item.unit,
    nutritionWeight: item.nutritionWeight ?? '',
    nutritionBasis: item.nutritionBasis ?? '100g',
    calories: item.calories ?? '',
    protein: item.protein ?? '',
    fat: item.fat ?? '',
    carbs: item.carbs ?? '',
  }))
  .filter((item) => item.name)


    if (!form.name.trim()) {
      setFormError('Введи название рецепта.')
      return
    }

    if (ingredients.length === 0) {
      setFormError('Добавь хотя бы один ингредиент.')
      return
    }

    if (ingredients.some((item) => !item.amount)) {
      setFormError('Укажи количество для каждого ингредиента.')
      return
    }

    const recipeData = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      image: form.image || '',
      category: form.category,
      time: Math.max(1, Number(form.time) || 1),
      servings: Math.max(1, Number(form.servings) || 1),
      weight: Number(form.weight) || 0,
     calories: calculateNutrition(ingredients)?.calories ?? '',
     protein: calculateNutrition(ingredients)?.protein ?? '',
     fat: calculateNutrition(ingredients)?.fat ?? '',
     carbs: calculateNutrition(ingredients)?.carbs ?? '',
      ingredients,
      description: form.notes.trim() || 'Домашний рецепт из твоей коллекции.',
      instructions: form.instructions.trim(),
      notes: form.notes.trim(),
      videoUrl: form.videoUrl.trim(),
      sourceUrl: form.sourceUrl.trim(),
      emoji: '🍽️',
    }

    if (editingId !== null) {
      setRecipes((current) =>
        current.map((recipe) =>
          recipe.id === editingId ? { ...recipeData, emoji: recipe.emoji } : recipe
        )
      )
    } else {
      setRecipes((current) => [recipeData, ...current])
    }

    setCategory('Все рецепты')
    setSearch('')
    setSelectedIngredients([])
    setOnlyFavorites(false)
    setIngredientMode(false)
    setShowForm(false)
    setEditingId(null)
    setForm(emptyForm)
    setFormError('')
  }

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    )
  }

  function toggleIngredient(ingredient) {
    setSelectedIngredients((current) =>
      current.includes(ingredient)
        ? current.filter((item) => item !== ingredient)
        : [...current, ingredient]
    )
  }

  function deleteRecipe(id) {
    if (!window.confirm('Удалить этот рецепт?')) return
    setRecipes((current) => current.filter((recipe) => recipe.id !== id))
    setFavorites((current) => current.filter((item) => item !== id))
    setSelectedRecipe(null)
  }

  function resetFilters() {
    setCategory('Все рецепты')
    setSearch('')
    setSelectedIngredients([])
    setOnlyFavorites(false)
  }

  const shoppingList = Object.values(mealPlan)
  .flatMap((recipeId) => {
    const recipe = recipes.find(
      (item) => String(item.id) === String(recipeId)
    )

    return recipe ? recipe.ingredients || [] : []
  })
  .reduce((list, ingredient) => {
    const name = ingredient.name?.trim()
    const amount = Number(
      String(ingredient.amount).replace(',', '.')
    )
    const unit = ingredient.unit || ''

    if (!name) return list

    const existing = list.find(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.unit === unit &&
        Number.isFinite(item.amount) &&
        Number.isFinite(amount)
    )

    if (Number.isFinite(amount)) {
      if (existing) {
        existing.amount += amount
      } else {
        list.push({ name, amount, unit })
      }
    } else {
      list.push({
        name,
        amount: ingredient.amount,
        unit,
      })
    }

    return list
  }, [])

  return (
    <main className="app">
      <header className="topbar">
        <button className="brand" onClick={() => {
          resetFilters()
          setShowForm(false)
          setSelectedRecipe(null)
          setShowPlanner(false)
        }}>
          <span className="brand-icon">♨</span>
          <span>Мои рецепты</span>
        </button>

        <div className="topbar-actions">
  <button
    className="planner-button"
    onClick={() => {
      setShowPlanner(true)
      setShowForm(false)
      setSelectedRecipe(null)
      setOnlyFavorites(false)
      setIngredientMode(false)
    }}
  >
    📅 План на неделю
  </button>

  <button
    className="favorites-button"
    onClick={() => {
      setOnlyFavorites((value) => !value)
      setShowForm(false)
      setShowPlanner(false)
      setIngredientMode(false)
    }}
  >
    ♥ {onlyFavorites ? 'Все рецепты' : `Избранное (${favorites.length})`}
  </button>

  <button className="add-button" onClick={() => {
    setShowPlanner(false)
    openNewRecipeForm()
  }}>
    + Добавить рецепт
  </button>
</div>
      </header>

      <section className="hero">
        <p className="eyebrow">ТВОЯ ЛИЧНАЯ КУЛИНАРНАЯ КНИГА</p>
        <h1>Что сегодня<br />приготовим?</h1>
        <p className="hero-text">
          Любимые рецепты в одном месте.
          Найди блюдо по ингредиентам и вдохновляйся!
        </p>

        <div className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти рецепт или продукт..."
          />
          {search && (
            <button onClick={() => setSearch('')}>Очистить</button>
          )}
        </div>
      </section>

      <section className="content">
        {showForm ? (
          <div className="recipe-form-panel">
            <div className="form-heading">
              <div>
                <p className="eyebrow">ТВОЯ КОЛЛЕКЦИЯ</p>
                <h2>{editingId !== null ? 'Редактировать рецепт' : 'Новый рецепт'}</h2>
              </div>
              <button className="cancel-button" type="button" onClick={() => setShowForm(false)}>
                Закрыть
              </button>
            </div>

            <form onSubmit={saveRecipe}>
              <label className="field">
                Название рецепта *
                <input
                  value={form.name}
                  onChange={(event) => updateForm('name', event.target.value)}
                  placeholder="Например, овощная запеканка"
                  required
                />
              </label>

              <div className="form-columns">
                <label className="field">
                  Категория
                  <select
                    value={form.category}
                    onChange={(event) => updateForm('category', event.target.value)}
                  >
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="field">
                  Время приготовления, минут
                  <input
                    type="number"
                    min="1"
                    value={form.time}
                    onChange={(event) => updateForm('time', event.target.value)}
                  />
                </label>
                <label className="field">
                  Количество порций
                  <input
                    type="number"
                    min="1"
                    value={form.servings}
                    onChange={(event) => updateForm('servings', event.target.value)}
                  />
                </label>
<label className="field">
  Вес готового блюда, г
  <input
    type="number"
    min="1"
    value={form.weight}
    onChange={(event) => updateForm('weight', event.target.value)}
    placeholder="Например, 650"
  />
</label>
              </div>

              <div className="recipe-image-upload">
  <label className="field">
    Фотография рецепта
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
    />
  </label>

  {form.image && (
    <div className="image-preview">
      <img src={form.image} alt="Предпросмотр рецепта" />

      <button
        type="button"
        className="cancel-button"
        onClick={() => updateForm('image', '')}
      >
        Удалить фотографию
      </button>
    </div>
  )}
</div>
              
<div className="form-row">
  <label className="field">
    Калорийность (ккал)
    <input
      type="number"
      min="0"
      value={form.calories}
      onChange={(event) => updateForm('calories', event.target.value)}
      placeholder="Например, 350"
    />
  </label>

  <label className="field">
    Белки (г)
    <input
      type="number"
      min="0"
      step="0.1"
      value={form.protein}
      onChange={(event) => updateForm('protein', event.target.value)}
      placeholder="Например, 12"
    />
  </label>
</div>

<div className="form-row">
  <label className="field">
    Жиры (г)
    <input
      type="number"
      min="0"
      step="0.1"
      value={form.fat}
      onChange={(event) => updateForm('fat', event.target.value)}
      placeholder="Например, 8"
    />
  </label>

  <label className="field">
    Углеводы (г)
    <input
      type="number"
      min="0"
      step="0.1"
      value={form.carbs}
      onChange={(event) => updateForm('carbs', event.target.value)}
      placeholder="Например, 45"
    />
  </label>
</div>


              <div className="ingredients-form-heading">
                <div>
                  <h3>Ингредиенты</h3>
                  <p>Каждый продукт добавляй отдельной строкой.</p>
                </div>
                <button className="filter-button" type="button" onClick={addIngredientRow}>
                  + Добавить продукт
                </button>
              </div>

              <div className="ingredient-rows">
                {form.ingredients.map((item, index) => (
                  <div className="ingredient-row" key={index}>
                    <label className="field ingredient-name-field">
                      <span>Продукт {index + 1}</span>
                      <input
                        value={item.name}
                        onChange={(event) => updateIngredient(index, 'name', event.target.value)}
                        placeholder="Например, картофель"
                      />
                    </label>
                    <label className="field ingredient-amount-field">
                      <span>Количество *</span>
                      <input
                        value={item.amount}
                        onChange={(event) => updateIngredient(index, 'amount', event.target.value)}
                        placeholder="200"
                      />
                    </label>
                    <label className="field ingredient-unit-field">
                      <span>Единица</span>
                      <select
                        value={item.unit}
                        onChange={(event) => updateIngredient(index, 'unit', event.target.value)}
                      >
                        {['г', 'кг', 'мл', 'л', 'шт.', 'ч. л.', 'ст. л.', 'по вкусу'].map((unit) =>
                          <option key={unit}>{unit}</option>
                        )}                
</select>
</label>

<div className="ingredient-nutrition-fields">

  <label className="field ingredient-basis-field">
    <span>КБЖУ указано на</span>
    <select
      value={item.nutritionBasis ?? '100g'}
      onChange={(event) =>
        updateIngredient(index, 'nutritionBasis', event.target.value)
      }
    >
      <option value="100g">100 г</option>
      <option value="100ml">100 мл</option>
    </select>
  </label>

  <label className="field">
    <span>
      Ккал на {item.nutritionBasis === '100ml' ? '100 мл' : '100 г'}
    </span>
    <input
      type="number"
      min="0"
      step="any"
      value={item.calories}
      onChange={(event) =>
        updateIngredient(index, 'calories', event.target.value)
      }
      placeholder="0"
    />
  </label>

  <label className="field ingredient-weight-field">
    <span>Вес для расчёта, г</span>
    <input
      type="number"
      min="0"
      step="any"
      value={item.nutritionWeight ?? ''}
      onChange={(event) =>
        updateIngredient(index, 'nutritionWeight', event.target.value)
      }
      placeholder="Например, 200"
    />
  </label>

  <label className="field">
    <span>Белки, г</span>
    <input
      type="number"
      min="0"
      step="any"
      value={item.protein}
      onChange={(event) =>
        updateIngredient(index, 'protein', event.target.value)
      }
      placeholder="0"
    />
  </label>

  <label className="field">
    <span>Жиры, г</span>
    <input
      type="number"
      min="0"
      step="any"
      value={item.fat}
      onChange={(event) =>
        updateIngredient(index, 'fat', event.target.value)
      }
      placeholder="0"
    />
  </label>

  <label className="field">
    <span>Углеводы, г</span>
    <input
      type="number"
      min="0"
      step="any"
      value={item.carbs}
      onChange={(event) =>
        updateIngredient(index, 'carbs', event.target.value)
      }
      placeholder="0"
    />
  </label>
</div>

<button
  className="remove-ingredient"
                      type="button"
                      onClick={() => removeIngredientRow(index)}
                      disabled={form.ingredients.length === 1}
                      aria-label="Удалить ингредиент"
                      title="Удалить продукт"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <label className="field">
                Способ приготовления
                <textarea
                  value={form.instructions}
                  onChange={(event) => updateForm('instructions', event.target.value)}
                  placeholder={'1. Подготовь продукты.\n2. Смешай ингредиенты.\n3. Приготовь до готовности.'}
                  rows={5}
                />
              </label>

              <label className="field">
                Заметки
                <textarea
                  value={form.notes}
                  onChange={(event) => updateForm('notes', event.target.value)}
                  placeholder="Секреты приготовления, варианты замены продуктов..."
                  rows={3}
                />
              </label>

              <label className="field">
  Ссылка на видео
  <input
    type="url"
    value={form.videoUrl}
    onChange={(event) => updateForm('videoUrl', event.target.value)}
    placeholder="https://www.youtube.com/..."
  />
</label>

<label className="field">
  Ссылка на источник рецепта
  <input
    type="url"
    value={form.sourceUrl}
    onChange={(event) => updateForm('sourceUrl', event.target.value)}
    placeholder="https://..."
  />
</label>

              {formError && <p className="form-error">{formError}</p>}

              <div className="form-actions">
                <button className="cancel-button" type="button" onClick={() => setShowForm(false)}>
                  Отмена
                </button>
                <button className="add-button" type="submit">
                  Сохранить рецепт
                </button>
              </div>
            </form>
          </div>
        ) : selectedRecipe ? (
          <div className="recipe-detail">
            <button className="cancel-button" onClick={() => setSelectedRecipe(null)}>
              ← К списку рецептов
            </button>
            <div className="detail-hero">
              {selectedRecipe.image ? (
  <img
    className="detail-recipe-image"
    src={selectedRecipe.image}
    alt={selectedRecipe.name}
  />
) : (
  <span>{selectedRecipe.emoji || '🍽️'}</span>
)}
              <p className="eyebrow">{selectedRecipe.category}</p>
              <h2>{selectedRecipe.name}</h2>
              <p>{selectedRecipe.time} минут</p>

<div className="servings-control">
  <span>Количество порций:</span>

  <button
    type="button"
    onClick={() =>
      setDisplayServings((current) => Math.max(1, current - 1))
    }
    disabled={displayServings <= 1}
  >
    −
  </button>

  <strong>{displayServings}</strong>

  <button
    type="button"
    onClick={() =>
      setDisplayServings((current) => current + 1)
    }
  >
    +
  </button>
</div>
            </div>
            {Number(selectedRecipe.weight) > 0 && (
  <div className="detail-section">
    <h3>Вес блюда</h3>
    <p>
      Вес всего блюда: {
        Math.round(
          Number(selectedRecipe.weight) * displayServings /
          Math.max(1, Number(selectedRecipe.servings) || 1)
        )
      } г
    </p>
    <p>
      Вес одной порции: {
        Math.round(
          Number(selectedRecipe.weight) /
          Math.max(1, Number(selectedRecipe.servings) || 1)
        )
      } г
    </p>
  </div>
)}
            <div className="detail-section">
  <h3>Пищевая ценность</h3>

  <div className="nutrition-tabs">
    <button
      type="button"
      className="filter-button"
      onClick={() => setNutritionView('total')}
    >
      Весь рецепт
    </button>

    <button
      type="button"
      className="filter-button"
      onClick={() => setNutritionView('serving')}
    >
      На порцию
    </button>

    <button
      type="button"
      className="filter-button"
      onClick={() => setNutritionView('100g')}
    >
      На 100 г
    </button>
  </div>

  {nutritionView === '100g' && !Number(selectedRecipe.weight) ? (
    <p>
      Чтобы рассчитать КБЖУ на 100 г, укажи вес готового блюда
      в граммах в форме редактирования рецепта.
    </p>
  ) : (
    <p>
      <strong>
        {selectedRecipe.calories == null || selectedRecipe.calories === ''
          ? '—'
          : Math.round(
              Number(selectedRecipe.calories) *
              nutritionMultiplier
            ) + ' ккал'}
      </strong>

      {' · '}Белки: {
        selectedRecipe.protein == null || selectedRecipe.protein === ''
          ? '—'
          : (
              Number(selectedRecipe.protein) *
              nutritionMultiplier
            ).toFixed(1)
      } г

      {' · '}Жиры: {
        selectedRecipe.fat == null || selectedRecipe.fat === ''
          ? '—'
          : (
              Number(selectedRecipe.fat) *
              nutritionMultiplier
            ).toFixed(1)
      } г

      {' · '}Углеводы: {
        selectedRecipe.carbs == null || selectedRecipe.carbs === ''
          ? '—'
          : (
              Number(selectedRecipe.carbs) *
              nutritionMultiplier
            ).toFixed(1)
      } г
    </p>
  )}
</div>

              <div className="detail-section">
              <h3>Ингредиенты</h3>
              <ul className="detail-ingredients">
                {selectedRecipe.ingredients.map((item, index) => (
                  <li key={index}>
                    <span>{item.name}</span>
                    <strong>
{(() => {
  const multiplier =
    displayServings / Math.max(1, Number(selectedRecipe.servings) || 1)

  const amountText = String(item.amount).trim()

  const range = amountText.match(
    /^(\d+(?:[.,]\d+)?)\s*[-–—]\s*(\d+(?:[.,]\d+)?)$/
  )

  if (range) {
    const first = Number(range[1].replace(',', '.')) * multiplier
    const second = Number(range[2].replace(',', '.')) * multiplier

    return `${Number(first.toFixed(2))}–${Number(second.toFixed(2))}`
  }

  const amount = Number(amountText.replace(',', '.'))

  if (Number.isFinite(amount) && amountText !== '') {
    return Number((amount * multiplier).toFixed(2))
  }

  return item.amount
})()} {item.unit}
</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="detail-section">
              <h3>Способ приготовления</h3>
              <p className="instructions-text">
                {selectedRecipe.instructions || 'Способ приготовления пока не добавлен.'}
              </p>
            </div>
            {selectedRecipe.notes && (
              <div className="detail-section">
                <h3>Заметки</h3>
                <p>{selectedRecipe.notes}</p>
              </div>
            )}
            {selectedRecipe.videoUrl && (
  <div className="detail-section">
    <h3>Видео</h3>
    <a
      href={selectedRecipe.videoUrl}
      target="_blank"
      rel="noreferrer"
    >
      ▶ Смотреть видео
    </a>
  </div>
)}

{selectedRecipe.sourceUrl && (
  <div className="detail-section">
    <h3>Источник рецепта</h3>
    <a
      href={selectedRecipe.sourceUrl}
      target="_blank"
      rel="noreferrer"
    >
      Открыть оригинальный рецепт
    </a>
  </div>
)}
            <div className="form-actions">
              <button className="filter-button" onClick={() => openEditForm(selectedRecipe)}>
                Редактировать
              </button>
              <button className="cancel-button" onClick={() => deleteRecipe(selectedRecipe.id)}>
                Удалить рецепт
              </button>
            </div>
          </div>
                ) : showPlanner ? (
          <div className="planner-panel">
  <h2>План питания на неделю</h2>
  <p>Выбери сохранённые рецепты для каждого приёма пищи.</p>
  <button
  type="button"
  className="cancel-button"
  onClick={() => {
    if (window.confirm('Очистить весь план питания на неделю?')) {
      setMealPlan({})
      setCheckedShoppingItems([])
    }
  }}
>
  Очистить план на неделю
</button>

  
<div className="planner-grid">
  {weekDays.map((day) => (
    <div className="planner-day" key={day.id}>
      <h3>{day.label}</h3>

      {mealTypes.map((meal) => {
  const slotKey = `${day.id}-${meal.id}`

  return (
    <div className="planner-meal" key={meal.id}>
      <label>{meal.label}</label>

      <input
        type="text"
        list={`recipes-${slotKey}`}
        placeholder="Введи название блюда..."
        value={
          recipes.find(
            (recipe) =>
              String(recipe.id) === String(mealPlan[slotKey])
          )?.name || mealPlan[slotKey] || ''
        }
        onChange={(event) => {
          const value = event.target.value

          const matchingRecipe = recipes.find(
            (recipe) =>
              recipe.name.toLowerCase() === value.trim().toLowerCase()
          )

          setMealPlan((current) => ({
            ...current,
            [slotKey]: matchingRecipe
              ? String(matchingRecipe.id)
              : value,
          }))
        }}
      />

      <datalist id={`recipes-${slotKey}`}>
        {recipes.map((recipe) => (
          <option key={recipe.id} value={recipe.name} />
        ))}
      </datalist>

      {mealPlan[slotKey] && (
        <button
          type="button"
          className="cancel-button"
          onClick={() => {
            setMealPlan((current) => {
              const updated = { ...current }
              delete updated[slotKey]
              return updated
            })
          }}
        >
          Убрать
        </button>
      )}
    </div>
  )
})}
    </div>
  ))}

  <div className="shopping-list">
    <h3>🛒 Список покупок на неделю</h3>

    {shoppingList.length === 0 ? (
      <p>Выбери рецепты в плане, чтобы составить список покупок.</p>
    ) : (
      <ul>
        {shoppingList.map((item, index) => {
          const itemKey = `${item.name.toLowerCase()}-${item.unit}`

          return (
            <li key={`${itemKey}-${index}`}>
              <label>
                <input
                  type="checkbox"
                  checked={checkedShoppingItems.includes(itemKey)}
                  onChange={(event) => {
                    setCheckedShoppingItems((current) =>
                      event.target.checked
                        ? [...current, itemKey]
                        : current.filter((key) => key !== itemKey)
                    )
                  }}
                />

                <span
                  style={{
                    textDecoration: checkedShoppingItems.includes(itemKey)
                      ? 'line-through'
                      : 'none',
                  }}
                >
                  {item.name} — {item.amount} {item.unit}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    )}
  </div>
</div>
</div>
        ) : (
          <>
            <div className="section-heading">
              <div>
                <p className="eyebrow">ТВОЯ КОЛЛЕКЦИЯ</p>
                <h2>{onlyFavorites ? 'Избранное' : 'Рецепты'}</h2>
              </div>
              <button className="filter-button" onClick={() => {
                setIngredientMode(!ingredientMode)
                setOnlyFavorites(false)
              }}>
                🥕 Подобрать по продуктам
              </button>
            </div>

            {ingredientMode && (
              <div className="ingredient-panel">
                <h3>Что есть у тебя дома?</h3>
                <p>Отметь продукты — покажем рецепты, в которых есть все выбранные ингредиенты.</p>
                <div className="ingredient-list">
                  {allIngredients.map((ingredient) => (
                    <label className="ingredient-chip" key={ingredient}>
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(ingredient)}
                        onChange={() => toggleIngredient(ingredient)}
                      />
                      {ingredient}
                    </label>
                  ))}
                </div>
                <button className="clear-button" onClick={() => setSelectedIngredients([])}>
                  Сбросить продукты
                </button>
              </div>
            )}

            <nav className="categories">
              {['Все рецепты', ...categories].map((item) => (
                <button
                  key={item}
                  className={category === item ? 'category active' : 'category'}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </nav>

            <div className="recipes-toolbar">
  <p className="result-count">
    Найдено рецептов: {filteredRecipes.length}
  </p>

  <div className="sort-control" ref={sortControlRef}>
  <button
    type="button"
    className={`sort-icon-button ${sortWasSelected ? 'active' : ''}`}
    onClick={() => setShowSortMenu((value) => !value)}
    aria-label="Сортировка рецептов"
    title="Сортировка"
  >
    <svg
  viewBox="0 0 24 24"
  width="22"
  height="22"
  fill="none"
  stroke="currentColor"
  strokeWidth="2.5"
  strokeLinecap="round"
  strokeLinejoin="round"
>
  <path d="M3 5h18M3 12h18M3 19h18" />
  <rect x="6" y="2.5" width="4" height="5" rx="1" fill="white" />
  <rect x="15" y="9.5" width="4" height="5" rx="1" fill="white" />
  <rect x="7" y="16.5" width="4" height="5" rx="1" fill="white" />
</svg>
  </button>

  {showSortMenu && (
    <div className="sort-menu">
      {[
        { value: 'newest', label: 'Сначала новые' },
        { value: 'alphabetical', label: 'По алфавиту (А–Я)' },
        { value: 'time', label: 'По времени приготовления' },
      ].map((option) => (
        <button
          type="button"
          key={option.value}
          className={sortOrder === option.value ? 'selected' : ''}
          onClick={() => {
  setSortOrder(option.value)
  setSortWasSelected(true)
  setShowSortMenu(false)
}}
        >
          {option.label}
          {sortOrder === option.value && <span>✓</span>}
        </button>
      ))}
        </div>
  )}
</div>
</div>

<div className="recipe-grid">
              {sortedRecipes.map((recipe) => (
                <article className="recipe-card" key={recipe.id}>
                  <div className="recipe-image">
  {recipe.image ? (
    <img src={recipe.image} alt={recipe.name} />
  ) : (
    <span>{recipe.emoji || '🍽️'}</span>
  )}
                    <button
                      className={favorites.includes(recipe.id) ? 'heart liked' : 'heart'}
                      onClick={() => toggleFavorite(recipe.id)}
                      aria-label="Добавить в избранное"
                    >
                      {favorites.includes(recipe.id) ? '♥' : '♡'}
                    </button>
                    <span className="time">◷ {recipe.time} мин.</span>
                  </div>
                  <div className="recipe-info">
                    <p className="recipe-category">{recipe.category}</p>
                    <h3>{recipe.name}</h3>
                                     
{(() => {
  const nutrition = calculateNutrition(recipe.ingredients)
  const servings = Math.max(1, Number(recipe.servings) || 1)

  const calories = nutrition?.calories ??
    (recipe.calories === '' || recipe.calories == null
      ? null
      : Number(recipe.calories))

  const protein = nutrition?.protein ??
    (recipe.protein === '' || recipe.protein == null
      ? null
      : Number(recipe.protein))

  const fat = nutrition?.fat ??
    (recipe.fat === '' || recipe.fat == null
      ? null
      : Number(recipe.fat))

  const carbs = nutrition?.carbs ??
    (recipe.carbs === '' || recipe.carbs == null
      ? null
      : Number(recipe.carbs))

  return (
    <p className="recipe-nutrition">
      <strong>
       {calories == null ? '—' : `${Math.round(calories / servings)} ккал`}
       </strong>
{' · Б: '}{protein == null ? '—' : (protein / servings).toFixed(1)}
{' · Ж: '}{fat == null ? '—' : (fat / servings).toFixed(1)}
{' · У: '}{carbs == null ? '—' : (carbs / servings).toFixed(1)}
    </p>
  )
})()}

                    <p className="ingredient-preview">
                      {recipe.ingredients.map((item) => item.name).join(' · ')}
                    </p>
                    <button
  className="details-button"
  onClick={() => {
    setSelectedRecipe(recipe)
    setDisplayServings(Number(recipe.servings) || 1)
    setNutritionView('total')
  }}
>
  Посмотреть рецепт →
</button>
                  </div>
                </article>
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="empty-state">
                <span>🍲</span>
                <h3>Пока ничего не найдено</h3>
                <p>Попробуй изменить поиск или убрать часть фильтров.</p>
                <button className="filter-button" onClick={resetFilters}>
                  Сбросить фильтры
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <footer>
        <span>♨ Мои рецепты</span>
        <p>Твоя коллекция вкусных идей</p>
      </footer>
    </main>
  )
}

export default App
