function toggleWishlist(element) 
{
    element.classList.toggle('filled');
}

function openFilterPanel() 
{
    document.getElementById('filterPanel').classList.add('open');
    document.getElementById('overlay').classList.add('show');
}

function closeFilterPanel() 
{
    document.getElementById('filterPanel').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function () 
{
    const products = document.querySelectorAll('.product-card');
    const brands_filter = document.getElementById('brand');
    const strap_filter = document.getElementById('Strap_Material');
    const movement_filter = document.getElementById('Movement');
    const water_resistance_filter = document.getElementById('Water_Resistance');
    const case_material_filter = document.getElementById('Case_Material');
    const price_range_from = document.getElementById('priceRangeFrom');
    const price_range_to = document.getElementById('priceRangeTo');
    const dial_color_filter = document.querySelectorAll('.dial-color');
    const sortButtons = document.querySelectorAll('[data-sort]');
    
    sortButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const sortType = this.dataset.sort;
            sortProducts(sortType);
            closeFilterPanel();
        });
    });

    function sortProducts(sortType) 
    {
        const productGrid = document.querySelector('.product-grid');
        const products = Array.from(productGrid.querySelectorAll('.product-card'));

        products.sort((a, b) => {
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);

            switch (sortType) 
            {
                case 'price-asc':
                    return priceA - priceB;
                case 'price-desc':
                    return priceB - priceA;
                default:
                    return 0;
            }
        });

        products.forEach(product => productGrid.appendChild(product));
        
        filterProducts();
    }

    function filterProducts() 
    {
        const chosen_brands = brands_filter.value;
        const chosen_strap = strap_filter.value;
        const chosen_movement = movement_filter.value;
        const chosen_water_resistance = water_resistance_filter.value;
        const chosen_case_material = case_material_filter.value;
        const chosen_price_from = parseFloat(price_range_from.value) || 0;
        const chosen_price_to = parseFloat(price_range_to.value) || 500000;
        const chosen_dial_color = Array.from(dial_color_filter)
            .filter(filter => filter.checked)
            .map(filter => filter.value);

        products.forEach(product => 
        {
            const productBrand = product.getAttribute('data-brand');
            const productStrap = product.getAttribute('data-strap-material');
            const productMovement = product.getAttribute('data-movement');
            const productWaterResistance = product.getAttribute('data-water-resistance');
            const productCaseMaterial = product.getAttribute('data-case-material');
            const productPrice = parseFloat(product.getAttribute('data-price'));
            const productDialColor = product.getAttribute('data-dial-color');

            const brandMatch = chosen_brands === 'All' || chosen_brands === productBrand;
            const strapMatch = chosen_strap === 'All' || chosen_strap === productStrap;
            const movementMatch = chosen_movement === 'All' || chosen_movement === productMovement;
            const waterResistanceMatch = chosen_water_resistance === 'All' || chosen_water_resistance === productWaterResistance;
            const caseMaterialMatch = chosen_case_material === 'All' || chosen_case_material === productCaseMaterial;
            const priceMatch = productPrice >= chosen_price_from && productPrice <= chosen_price_to;
            const dialColorMatch = chosen_dial_color.length === 0 || chosen_dial_color.includes('All') || chosen_dial_color.includes(productDialColor);

            if (brandMatch && strapMatch && movementMatch && waterResistanceMatch && caseMaterialMatch && priceMatch && dialColorMatch) 
            {
                product.style.display = 'block';
            } 
            else 
            {
                product.style.display = 'none';
            }
        });
    }

    document.querySelector('.submit').addEventListener('click', function (event) 
    {
        event.preventDefault();
        filterProducts();
        closeFilterPanel();
    });

    document.querySelector('.clear').addEventListener('click', function (event) 
    {
        event.preventDefault();
        brands_filter.value = 'All';
        strap_filter.value = 'All';
        movement_filter.value = 'All';
        water_resistance_filter.value = 'All';
        case_material_filter.value = 'All';
        price_range_from.value = '0';
        price_range_to.value = '500000';
        dial_color_filter.forEach(filter => filter.checked = false);
        filterProducts();
    });

    filterProducts();
});