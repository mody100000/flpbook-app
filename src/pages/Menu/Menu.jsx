import React, { useState } from 'react';
import menu from '@assets/menu.jpg';
import styled from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FullScreenImage = styled.img`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  padding: 3rem 2rem 0 0;
`;

const ImageMapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ImageMapArea = styled.div`
  position: absolute;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 800px;
  max-height: 90%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f7f7f7;
  padding: 1.5rem 2rem;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ModalTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const CategoryContainer = styled.div`
  padding: 2rem;
  flex-grow: 1;
`;

const CategoryTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const CategoryArabicTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const MenuItemList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const MenuItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MenuItemIngredients = styled.div`
  font-size: 0.875rem;
  color: #666;
  padding-right: 1rem;
  display: flex;
  justify-content :end
`;

const MenuItemName = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const MenuItemPrice = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #007bff;
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7f7f7;
  padding: 1rem 2rem;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const NavigationButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;

  &:hover {
    color: #333;
  }
`;

const categories = {
  'فرق باستا': {
    arabic: 'فرق باستا',
    items: [
      {
        name: 'سباغيتي بولونيز',
        price: '135',
        ingredients: 'معكرونة سباغيتي، صلصة طماطم، لحم مفروم، بصل، ثوم، جزر، كرفس، أعشاب إيطالية'
      },
      {
        name: 'فيتوتشيني ألفريدو',
        price: '140',
        ingredients: 'معكرونة فيتوتشيني، كريمة طازجة، زبدة، جبنة بارميزان، ثوم، بقدونس'
      },
      {
        name: 'بيني أربياتا',
        price: '130',
        ingredients: 'معكرونة بيني، صلصة طماطم حارة، ثوم، فلفل أحمر حار، زيت زيتون، بقدونس'
      },
      {
        name: 'رافيولي بالجبنة',
        price: '145',
        ingredients: 'عجينة رافيولي محشوة، جبنة ريكوتا، جبنة موزاريلا، صلصة طماطم، ريحان'
      },
    ],
  },
  'اضافات': {
    arabic: 'اضافات',
    items: [
      {
        name: 'جبنة بارميزان',
        price: '5',
        ingredients: 'جبنة بارميزان إيطالية طازجة'
      },
      {
        name: 'بقدونس طازج',
        price: '3',
        ingredients: 'بقدونس طازج مفروم'
      },
      {
        name: 'صلصة الفلفل الحار',
        price: '4',
        ingredients: 'فلفل حار، ثوم، زيت زيتون، توابل'
      },
      {
        name: 'زيتون أسود',
        price: '6',
        ingredients: 'زيتون أسود يوناني'
      },
    ],
  },
  'حلويات شرقية': {
    arabic: 'حلويات شرقية',
    items: [
      {
        name: 'بقلاوة بالفستق',
        price: '118',
        ingredients: 'عجينة فيلو، فستق حلبي، سمن، شربات سكر، ماء زهر'
      },
      {
        name: 'كنافة نابلسية',
        price: '120',
        ingredients: 'شعيرية كنافة، جبنة عكاوي، قطر، فستق مطحون، زبدة'
      },
      {
        name: 'زنود الست',
        price: '161',
        ingredients: 'عجينة فيلو، قشطة، مكسرات، قطر، ماء زهر'
      },
      {
        name: 'بسبوسة',
        price: '115',
        ingredients: 'سميد، جوز هند، سمن، سكر، لبن، قطر'
      },
    ],
  },
  'اطباق اللحوم الرئيسية': {
    arabic: 'اطباق اللحوم الرئيسية',
    items: [
      {
        name: 'كباب لحم',
        price: '155',
        ingredients: 'لحم غنم مفروم، بصل، بقدونس، بهارات، صنوبر'
      },
      {
        name: 'شيش طاووق',
        price: '150',
        ingredients: 'دجاج متبل، ليمون، ثوم، زبادي، بهارات، زيت زيتون'
      },
      {
        name: 'لحمة مشوية',
        price: '160',
        ingredients: 'شرائح لحم غنم، بصل، فلفل، طماطم، بهارات'
      },
      {
        name: 'لحم بعجين',
        price: '145',
        ingredients: 'عجينة رقيقة، لحم مفروم، بصل، طماطم، بهارات، صنوبر'
      },
    ],
  },
  'اطباق الدجاج الرئيسية': {
    arabic: 'اطباق الدجاج الرئيسية',
    items: [
      {
        name: 'دجاج بالفرن مع بطاطس',
        price: '140',
        ingredients: 'دجاج متبل، بطاطس، ثوم، ليمون، زعتر، زيت زيتون'
      },
      {
        name: 'دجاج بانيه',
        price: '135',
        ingredients: 'صدور دجاج، بقسماط، بيض، توابل، بطاطس مقلية'
      },
      {
        name: 'دجاج مشوي',
        price: '138',
        ingredients: 'دجاج كامل متبل، ليمون، ثوم، بهارات، زيت زيتون'
      },
      {
        name: 'مسحب الدجاج',
        price: '132',
        ingredients: 'دجاج مسحب، خبز مرقوق، صنوبر، سمن، بهارات'
      },
    ],
  },
  'ستربس': {
    arabic: 'ستربس',
    items: [
      {
        name: 'ستربس دجاج',
        price: '128',
        ingredients: 'شرائح دجاج مقرمشة، بقسماط، صوص، خس'
      },
      {
        name: 'ستربس بالجبنة',
        price: '130',
        ingredients: 'شرائح دجاج مقرمشة، جبنة موزاريلا، صوص خاص، خس'
      },
      {
        name: 'ستربس حار',
        price: '130',
        ingredients: 'شرائح دجاج مقرمشة، صوص حار، فلفل حار، خس'
      },
      {
        name: 'ستربس مع بطاطس',
        price: '132',
        ingredients: 'شرائح دجاج مقرمشة، بطاطس مقلية، صوص، خس'
      },
    ],
  },
};


function Menu() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const categoryKeys = Object.keys(categories);

  const handleImageMapClick = (category) => {
    setSelectedCategory(category);
    setCurrentIndex(categoryKeys.indexOf(category));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setCurrentIndex(0);
  };

  const handlePrevCategory = () => {
    setCurrentIndex((currentIndex - 1 + categoryKeys.length) % categoryKeys.length);
    setSelectedCategory(categoryKeys[currentIndex]);
  };

  const handleNextCategory = () => {
    setCurrentIndex((currentIndex + 1) % categoryKeys.length);
    setSelectedCategory(categoryKeys[currentIndex]);
  };

  const imageMapAreas = [
    {
      x: 11.5,
      y: 18,
      width: 30,
      height: 20,
      data: 'فرق باستا',
    },
    {
      x: 11.5,
      y: 42,
      width: 30,
      height: 28,
      data: 'اضافات',
    },
    {
      x: 11.5,
      y: 72,
      width: 31,
      height: 19,
      data: 'حلويات شرقية',
    },
    {
      x: 60,
      y: 55,
      width: 31,
      height: 20,
      data: 'اطباق اللحوم الرئيسية',
    },
    {
      x: 60,
      y: 20,
      width: 31,
      height: 28,
      data: 'اطباق الدجاج الرئيسية',
    },
    {
      x: 60,
      y: 75,
      width: 31,
      height: 28,
      data: 'ستربس',
    },
  ];

  return (
    <div className="h-screen flex justify-center items-center overflow-hidden font-arabic">
      <FullScreenImage src={menu} alt="menu image" />
      <ImageMapContainer>
        {imageMapAreas.map((area, index) => (
          <ImageMapArea
            key={index}
            style={{
              left: `${area.x}%`,
              top: `${area.y}%`,
              width: `${area.width}%`,
              height: `${area.height}%`,
            }}
            onClick={() => handleImageMapClick(area.data)}
          />
        ))}
      </ImageMapContainer>
      {showModal && (
        <Modal>
          <ModalHeader>
            <ModalTitle>{selectedCategory}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </CloseButton>
          </ModalHeader>
          <CategoryContainer>
            <MenuItemList>
              {categories[selectedCategory].items.map((item, index) => (
                <MenuItem key={index}>
                  <MenuItemHeader dir='rtl'>
                    <MenuItemName>{item.name}</MenuItemName>
                    <MenuItemPrice dir='rtl'>EGP {item.price}</MenuItemPrice>
                  </MenuItemHeader>
                  <MenuItemIngredients>{item.ingredients}</MenuItemIngredients>
                </MenuItem>
              ))}
            </MenuItemList>
          </CategoryContainer>
          <NavigationContainer>
            <NavigationButton onClick={handlePrevCategory}>
              <ChevronLeft size={24} />
              Previous
            </NavigationButton>
            <NavigationButton onClick={handleNextCategory}>
              Next
              <ChevronRight size={24} />
            </NavigationButton>
          </NavigationContainer>
        </Modal>
      )}
    </div>
  );
}

export default Menu;