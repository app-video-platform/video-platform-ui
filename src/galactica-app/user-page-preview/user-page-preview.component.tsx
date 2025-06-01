/* eslint-disable quotes */
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import { selectAllProducts } from '../../store/product-store/product.selectors';
import { User } from '../../models/user/user';
import { BaseProduct } from '../../models/product/product';
import ProductCard from '../../components/product-box/product-box.component';

import './user-page-preview.styles.scss';
import { ProductStatus, ProductType } from '../../models/product/product.types';

const UserPagePreview: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const products = useSelector(selectAllProducts);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [otherProducts, setOtherProducts] = useState<BaseProduct[]>([]);

  const [downloads, setDownloads] = useState<BaseProduct[]>([]);
  const [courses, setCourses] = useState<BaseProduct[]>([]);
  const [consultations, setConsultations] = useState<BaseProduct[]>([]);

  useEffect(() => {
    const mockUser: User = {
      email: 'myemail@domain.test',
      firstName: 'Gica',
      lastName: 'Hagi',
      role: ['User'],
      id: '',
    };

    const now = new Date(Date.now());

    const mockProducts: BaseProduct[] = [
      {
        createdAt: now,
        customers: 7,
        description: 'Lorem Ipsum dolor sit amet',
        id: '1',
        image: '',
        name: 'How to shave your balls download package',
        price: 7.99,
        status: 'draft',
        type: 'DOWNLOAD',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 198,
        description:
          'Lorem Ipsum dolor sit amet, senectutem nivetutem, sa mai futem, cat mai putem. Si daca merge marinimia sa la paste, sa mearga' +
          ' cu chilotii in spate, ca sa nu atace pestele nebun. Asa mai astept si eu putin descrierea pacii.',
        id: '2',
        image: '',
        name: "1:1 sex chat 'consultation'",
        price: 1.99,
        status: 'draft',
        type: 'CONSULTATION',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 72,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum leo in cursus accumsan. Sed vehicula ipsum vitae ex cursus,' +
          ' at placerat nunc ultrices. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec malesuada, orci eget lobortis ' +
          'pharetra, eros urna aliquet quam, eget eleifend odio elit quis libero. Sed sed eleifend eros. Nulla sagittis porttitor felis, et ' +
          'placerat velit interdum at. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras diam nisi, accumsan quis consectetur ' +
          'dapibus, volutpat eu turpis. Donec pulvinar bibendum neque sed volutpat. Vestibulum bibendum est ut tempor molestie.',
        id: '3',
        image: '',
        name: 'Finding aliens in you backyard bush course',
        price: 'free',
        status: 'draft',
        type: 'COURSE',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 653,
        description:
          'Donec volutpat ac orci vel suscipit. Quisque non porttitor velit, vel congue ex. Nulla facilisi. Morbi tortor dolor, vulputate in' +
          ' dictum vitae, laoreet ac sapien. Morbi placerat tincidunt porttitor. Aliquam in fermentum lorem, a tincidunt urna. Sed ' +
          'sollicitudin nunc id erat gravida luctus. Suspendisse potenti. Cras finibus consectetur tincidunt. Suspendisse tristique dictum ' +
          'ultricies. Donec eu consectetur augue.',
        id: '4',
        image: '',
        name: 'How to train your dragon',
        price: 14.99,
        status: 'draft',
        type: 'COURSE',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 19,
        description:
          'Vestibulum at interdum nibh. Quisque sollicitudin, nisi in scelerisque interdum, erat dui aliquam lacus, non porttitor dolor' +
          ' felis vel turpis. Suspendisse at scelerisque quam. Etiam lacinia sem sagittis gravida gravida. Nulla gravida venenatis nisi, ' +
          'et fringilla neque pretium a. Integer condimentum pellentesque dolor, eget varius sapien maximus sit amet. Maecenas accumsan a ' +
          'dolor ac porta. Sed vestibulum maximus consectetur. Duis sit amet dolor et ligula tincidunt lobortis quis at neque.',
        id: '5',
        image: '',
        name: 'Thinking of a good name for mocking',
        price: 89.99,
        status: 'draft',
        type: 'COURSE',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 270,
        description:
          'Praesent ac rhoncus risus. Ut tincidunt vitae orci nec fermentum. Donec sodales velit ut vulputate dictum. Nullam vel ' +
          'lorem quis lacus tempus euismod eu ac leo. Quisque dictum lacus eros, ut consectetur ipsum sollicitudin sed. Proin feugiat' +
          ' risus ac lectus pretium efficitur. Maecenas mattis, est eu egestas pulvinar, ex ipsum rhoncus tortor, sit amet tristique' +
          ' sem ligula eu ex.',
        id: '6',
        image: '',
        name: 'If you want to wistle, learn how',
        price: 2099.99,
        status: 'draft',
        type: 'CONSULTATION',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 55,
        description:
          'Integer efficitur elit neque, nec ultricies quam accumsan vitae. Cras eget malesuada quam, eget accumsan nunc.' +
          ' Quisque fringilla, diam sit amet ullamcorper venenatis, justo elit bibendum libero, in pretium neque felis vitae leo. ' +
          'Phasellus id accumsan risus, nec vulputate sapien. Duis consectetur dui eu lorem congue, ac auctor nisl dictum. ' +
          'Aliquam congue felis sed rutrum dictum. In ultrices suscipit iaculis. Sed vel lorem consequat, tincidunt mi quis,' +
          ' pharetra lectus. Pellentesque eu velit non odio elementum aliquam eget placerat tortor. Nam at ligula quam. ' +
          'Nulla commodo orci metus, a feugiat lectus mattis dignissim. Integer pretium malesuada blandit.',
        id: '7',
        image: '',
        name: 'How to spot people naming your penis',
        price: 'free',
        status: 'draft',
        type: 'DOWNLOAD',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 76,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum leo in cursus accumsan. Sed vehicula ipsum vitae' +
          ' ex cursus, at placerat nunc ultrices. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec malesuada,' +
          ' orci eget lobortis pharetra, eros urna aliquet quam, vel suscipit. Quisque non porttitor velit, vel congue ex.' +
          ' Nulla facilisi. Morbi tortor dolor, vulputate in dictum vitae, laoreet ac sapien. Morbi placerat tincidunt porttitor. ' +
          'Aliquam in fermentum lorem, a tincidunt urna. Sed sollicitudin nunc id erat gravida luctus. Suspendisse potenti. ' +
          'Cras finibus consectetur tincidunt. Suspendisse tristique dictum ultricies. Donec eu consectetur augue.',
        id: '8',
        image: '',
        name: 'Flirting with Santa Claus Live Example',
        price: 'free',
        status: 'draft',
        type: 'CONSULTATION',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 3,
        description:
          'Praesent ac rhoncus risus. Ut tincidunt vitae orci nec fermentum. Donec sodales velit ut vulputate dictum. ' +
          'Nullam vel lorem quis lacus tempus euismod eu ac leo. Quisque dictum lacus eros, ut consectetur ipsum sollicitudin sed. ' +
          'Proin feugiat risus ac lectus pretium efficitur. Maecenas mattis, est eu egestas pulvinar, ex ipsum rhoncus tortor,' +
          ' sit amet tristique sem ligula eu ex.',
        id: '9',
        image: '',
        name: 'What do we do when aliens cum',
        price: 22.57,
        status: 'draft',
        type: 'COURSE',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 56,
        description:
          'Donec commodo pharetra purus, in faucibus libero blandit a. Pellentesque iaculis lorem at eros tempor hendrerit.' +
          ' Aliquam viverra, velit eget ultricies semper, magna nibh volutpat ex, vitae consequat mi felis id enim. ' +
          'Vestibulum tempus faucibus neque, in pretium justo volutpat eget. Praesent ac odio fermentum, facilisis magna quis, ' +
          'lobortis augue. Integer blandit dapibus nunc, quis euismod nibh congue eget. Aliquam erat volutpat. Mauris nec luctus ' +
          'sapien. Vivamus tincidunt maximus varius. Phasellus fermentum quam non metus volutpat tincidunt. Curabitur porttitor ' +
          'nisi mi, quis posuere magna suscipit sed. Vestibulum nec vestibulum justo. Etiam convallis molestie justo, a egestas ' +
          'lectus varius eget. Proin tincidunt efficitur nulla, a porta justo porta a. Mauris non tempor ante. Nam eget cursus ' +
          'metus. Fusce tempus, lorem eu feugiat ultrices, nisl ex sagittis lorem, quis congue erat turpis eu neque. Nullam tristique' +
          ' tincidunt neque, nec faucibus arcu finibus sed. Sed dapibus, libero id imperdiet pulvinar, erat lacus ullamcorper' +
          ' risus, vitae ornare libero ex eget mi.',
        id: '10',
        image: '',
        name: 'Befriending Pigeons on Your Rooftop Safari',
        price: 9.99,
        status: 'draft',
        type: 'DOWNLOAD',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 98,
        description:
          'Etiam sed eros semper, suscipit est vitae, tempus nulla. Duis et neque id enim facilisis porta. Suspendisse ' +
          'sodales pharetra ex in volutpat. Vestibulum consequat libero ac ligula tincidunt dapibus. Curabitur ullamcorper' +
          ' sapien sit amet magna convallis, eu tincidunt mi blandit. In gravida accumsan pharetra. Pellentesque ac sem ' +
          'et nunc placerat congue ac eget sapien. Nam pulvinar, neque in laoreet scelerisque, justo justo dictum erat, in dapibus ' +
          'lectus massa at libero. Nullam mollis lacinia eros, eget ornare erat hendrerit eu. Morbi sed orci scelerisque, ' +
          'venenatis justo vel, tincidunt sapien. Duis semper felis eget turpis eleifend, eget dictum nunc laoreet. Praesent' +
          ' sed nunc nulla. Nullam ac ornare turpis, sed imperdiet ex. Quisque a bibendum metus. Nullam consequat fermentum ' +
          'massa, sed tincidunt ex dictum at. Cras non enim imperdiet, rutrum sem nec, auctor magna. Sed non faucibus libero. ' +
          'Quisque tristique mollis risus, nec fringilla diam scelerisque et. Vestibulum fringilla ligula vel ex sagittis pulvinar.',
        id: '11',
        image: '',
        name: "Unlocking the Secrets of the Unicorn's Mane",
        price: 14.99,
        status: 'published',
        type: 'COURSE',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 453,
        description:
          'Vivamus tempus varius sapien nec blandit. Nulla iaculis libero at felis pellentesque pulvinar. Nam volutpat feugiat felis,' +
          ' eu euismod nunc ultrices in. Suspendisse aliquam venenatis urna, vitae vulputate justo posuere at. Aliquam erat volutpat.' +
          ' Aenean pellentesque ultrices feugiat. Cras sagittis, justo non efficitur pharetra, sem lorem sagittis nulla, quis tristique ' +
          'diam orci sed turpis. Suspendisse id mi a velit hendrerit fermentum. Pellentesque in volutpat sem. Aliquam at imperdiet odio,' +
          ' id placerat ante. Phasellus quis eros lobortis, egestas massa vitae, aliquam libero. Donec nec convallis leo. Aenean ' +
          'luctus massa sed urna faucibus, at porttitor leo molestie. Proin at tincidunt sem. Aliquam suscipit dolor id purus ' +
          'fringilla fringilla. Aenean fermentum, sem eget consectetur scelerisque, magna nunc faucibus orci, vitae porta est ' +
          'neque sit amet nisl. Fusce nec diam commodo, ultricies magna in, lacinia nisi. Mauris venenatis lorem sed sapien tempus iaculis.',
        id: '12',
        image: '',
        name: 'Dragon Whispering 101: Taming the Fiery Beasts',
        price: 49.99,
        status: 'draft',
        type: 'COURSE',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 212,
        description:
          'Phasellus dapibus tortor eu nulla hendrerit, et porta arcu scelerisque. Praesent laoreet dignissim nibh, a consequat ' +
          'nunc malesuada vitae. Sed auctor consequat justo, eu dignissim felis vestibulum at. Phasellus sed justo lectus. Vivamus ' +
          'pulvinar quam quis porta luctus. Aliquam at vehicula enim, a ultrices ante. Suspendisse auctor est et ex hendrerit, non ' +
          'aliquet risus ultrices. Aliquam iaculis lorem justo, et convallis tortor lobortis id. Aliquam tincidunt dolor mi, a ' +
          'efficitur ipsum ornare a. Integer ac faucibus lorem. Aenean quis velit eu diam facilisis fermentum eu ac libero. Praesent ' +
          'ac mollis lectus, non rhoncus nunc. Mauris eu erat non dui vulputate tincidunt. Suspendisse consectetur cursus nisi, non ' +
          'dapibus nisi malesuada eget. Pellentesque viverra, nisl eget rutrum posuere, arcu quam porttitor est, eget ultricies neque ' +
          'felis quis nisl. Maecenas vulputate mi et sapien pretium congue. Sed dictum odio ac magna finibus, a placerat metus gravida.',
        id: '13',
        image: '',
        name: 'Galactic Hitchhiking for Interstellar Nomads',
        price: 'free',
        status: 'draft',
        type: 'CONSULTATION',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 75,
        description:
          'In id augue sodales, facilisis elit ac, volutpat dui. Quisque in dictum neque. Etiam facilisis lectus non efficitur convallis. ' +
          'Proin id mi sed metus bibendum malesuada. Praesent in venenatis enim, quis laoreet urna. Suspendisse egestas justo arcu, vel ' +
          'tincidunt lectus finibus eu. Praesent et sapien fermentum, sollicitudin justo sed, gravida risus. Suspendisse quis faucibus ' +
          'lectus, vel posuere odio. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. ' +
          'Pellentesque consequat lobortis tellus, ac hendrerit sem ullamcorper at. Aenean non velit sed massa placerat commodo. Quisque ' +
          'pretium nisl eu luctus blandit. Vivamus et metus sed lectus congue ultricies non eu elit. Mauris a volutpat orci, a tempus ' +
          'lacus. Praesent vel nisl efficitur, lobortis sem a, dapibus felis. Vestibulum ante ipsum primis in faucibus orci luctus et ' +
          'ultrices posuere cubilia curae; Fusce molestie risus a massa molestie, id finibus dui feugiat. Proin id varius odio. Donec ' +
          'vel leo quis purus porttitor molestie. Integer a finibus nulla.',
        id: '14',
        image: '',
        name: 'Pirate Linguistics: Mastering the RRR',
        price: 19.95,
        status: 'published',
        type: 'COURSE',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 345,
        description:
          'Integer non arcu laoreet, dictum justo vitae, malesuada justo. Quisque quis nunc eget diam faucibus placerat. Cras ' +
          'maximus nulla in massa rutrum ornare. Suspendisse fermentum consequat massa at ultrices. Suspendisse viverra convallis ' +
          'tristique. Etiam molestie, nisl a iaculis vehicula, massa lectus commodo velit, vel ultricies diam diam sit amet eros. ' +
          'Aenean sit amet neque ultricies, fringilla justo at, viverra enim. Maecenas dignissim sapien at sem convallis, at imperdiet ' +
          'quam dignissim. Suspendisse eget lorem augue. Nullam et nunc mi. In id ullamcorper risus. Morbi malesuada augue ut ex ' +
          'semper facilisis. Sed consequat sapien orci, ac convallis magna pharetra sed. Praesent non nibh in neque lacinia tincidunt. ' +
          'Sed ac nisi magna. Curabitur bibendum est sed vehicula finibus. Donec vel magna ipsum. Fusce a leo ut leo aliquam hendrerit ' +
          'at non est. Quisque sagittis blandit dignissim. Mauris tristique, lacus a vestibulum blandit, metus nunc eleifend enim, ' +
          'ac mollis urna dui nec orci.',
        id: '15',
        image: '',
        name: 'Spinning Yarn from Moonlight: The Ultimate Crochet',
        price: 4.99,
        status: 'draft',
        type: 'DOWNLOAD',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 887,
        description:
          'Nulla gravida magna eget purus ullamcorper tincidunt. Etiam molestie metus sed nisi sodales, at luctus purus convallis. ' +
          'Vestibulum vitae vehicula lectus. Etiam ac blandit elit, vel finibus neque. Morbi sed nisl eu dui tristique bibendum. ' +
          'Suspendisse hendrerit enim vel enim gravida, a tempor massa bibendum. Nulla vitae felis risus. Suspendisse ac nunc vel ' +
          'metus bibendum eleifend non id diam. Aenean nec congue purus. Quisque lobortis feugiat arcu, sed ultrices ex faucibus in. ' +
          'Praesent ac neque quam. In ullamcorper, purus vitae auctor efficitur, ipsum magna ornare ex, ac semper tortor quam at nisi. ' +
          'Morbi eu massa a nisl convallis rutrum. Fusce egestas quam tellus, ac vestibulum libero laoreet eget. Sed congue malesuada ' +
          'ex, et bibendum urna. In vitae urna luctus, blandit leo sed, suscipit mi. Integer malesuada sem sit amet enim finibus ornare. ' +
          'Sed efficitur tincidunt erat, ac rhoncus diam volutpat ac. Fusce sit amet turpis non metus volutpat sodales non vitae turpis.',
        id: '16',
        image: '',
        name: 'Constructing Interdimensional Doors with Household Supplies',
        price: 199.99,
        status: 'published',
        type: 'CONSULTATION',
        updatedAt: now,
        userId: '',
      },
      {
        createdAt: now,
        customers: 63,
        description:
          // eslint-disable-next-line max-len
          'Aenean ornare, turpis non aliquam lacinia, sem felis semper tellus, a ultricies velit nisl et turpis. Vivamus egestas urna quis magna lobortis, vitae consequat lectus sodales. Maecenas semper odio nisi, ac lobortis nunc molestie eget. Sed lobortis lobortis neque. Suspendisse blandit suscipit sem, vel bibendum eros interdum at. Phasellus posuere tellus ac massa iaculis, quis laoreet neque laoreet. Etiam finibus, diam vitae pharetra iaculis, enim felis congue nulla, nec tempor metus arcu ac risus. Vestibulum consequat congue sodales. Pellentesque vel commodo lacus. Proin luctus elit in leo dapibus auctor. Suspendisse faucibus consequat turpis, id scelerisque elit hendrerit nec. Nullam tristique lacinia feugiat. Duis et tellus dictum, commodo mi at, placerat diam. Suspendisse quis leo non velit hendrerit feugiat non in nulla. Praesent quis pharetra orci. Curabitur a odio non nisi dapibus convallis. Quisque et risus neque. Aliquam pellentesque mollis odio quis tempor. Vivamus cursus sapien eget nulla dictum tempus. Nulla vitae justo quam.',
        id: '17',
        image: '',
        name: 'Mastering the Art of Underwater Bowling',
        price: 2.49,
        status: 'draft',
        type: 'DOWNLOAD',
        updatedAt: now,
        userId: '',
      },
    ];

    if (user) {
      setOtherUser(user);
    } else {
      setOtherUser(mockUser);
    }

    if (products && products.length > 0) {
      const mappedProducts = products.map((product) => {
        const updatedProduct: BaseProduct = {
          ...product,
          createdAt: now,
          customers: 0,
          updatedAt: now,
          image: '',
          type: product.type as ProductType,
          status: product.status as ProductStatus,
          name: product.name || 'Untitled Product',
          description: product.description || 'No description available',
          price: product.price || 'free',
          userId: product.userId || '',
        };

        return updatedProduct;
      });
      setOtherProducts(mappedProducts);
    } else {
      console.log('get here', mockProducts);

      setOtherProducts(mockProducts);
    }

    // if (otherProducts && otherProducts.length > 0) {
    //   setDownloads(otherProducts.filter((p) => p.type === 'DOWNLOAD'));
    //   setCourses(otherProducts.filter((p) => p.type === 'COURSE'));
    //   setConsultations(otherProducts.filter((p) => p.type === 'CONSULTATION'));

    //   console.log(otherProducts, downloads, courses, consultations);
    // }
  }, [user, products]);

  useEffect(() => {
    // Only filter if we actually have otherProducts
    if (!otherProducts || otherProducts.length === 0) {
      return;
    }

    setDownloads(otherProducts.filter((p) => p.type === 'DOWNLOAD'));
    setCourses(otherProducts.filter((p) => p.type === 'COURSE'));
    setConsultations(otherProducts.filter((p) => p.type === 'CONSULTATION'));
  }, [otherProducts]); // Runs whenever otherProducts changes

  // const downloads = useMemo(
  //   () => otherProducts.filter((p) => p.type === 'DOWNLOAD'),
  //   [products]
  // );
  // const courses = useMemo(
  //   () => otherProducts.filter((p) => p.type === 'COURSE'),
  //   [products]
  // );
  // const consultations = useMemo(
  //   () => otherProducts.filter((p) => p.type === 'CONSULTATION'),
  //   [products]
  // );

  return (
    <div>
      <div className="user-details">
        <div className="profile-picture"></div>
        <h2>
          {otherUser?.firstName} {otherUser?.lastName}
        </h2>
        <span>Member since: March 2012</span>
      </div>

      <div>
        <h2 className="user-page-category-header">Downloads</h2>
        <div className="products-list">
          {downloads.map((item) => (
            <div key={item.id}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>

        <h2 className="user-page-category-header">Courses</h2>
        <div className="products-list">
          {courses.map((item) => (
            <div key={item.id}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>

        <h2 className="user-page-category-header">Consultations</h2>
        <div className="products-list">
          {consultations.map((item) => (
            <div key={item.id}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPagePreview;
